#!/usr/bin/env python3
# Copyright 2017 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Joy detection demo."""
import argparse
import requests
import collections
import contextlib
import io
import logging
import math
import os
import queue
import signal
import sys
import threading
import time
import json

from PIL import Image, ImageDraw, ImageFont
from picamera import PiCamera

from aiy.board import Board
from aiy.leds import Color, Leds, Pattern, PrivacyLed
from aiy.toneplayer import TonePlayer
from aiy.vision.inference import CameraInference
from aiy.vision.models import face_detection
from aiy.vision.streaming.server import StreamingServer
from aiy.vision.streaming import svg
from aiy.vision.annotator import Annotator
from timeit import default_timer as timer

logger = logging.getLogger(__name__)

JOY_COLOR = (255, 70, 0)
SAD_COLOR = (0, 0, 64)

JOY_SCORE_HIGH = 0.85
JOY_SCORE_LOW = 0.10

JOY_SOUND = ('C5q', 'E5q', 'C6q')
SAD_SOUND = ('C6q', 'E5q', 'C5q')
MODEL_LOAD_SOUND = ('C6w', 'c6w', 'C6w')
BEEP_SOUND = ('E6q', 'C6q')

FONT_FILE = '/usr/share/fonts/truetype/freefont/FreeSans.ttf'

BUZZER_GPIO = 22

@contextlib.contextmanager
def stopwatch(message):
    try:
        logger.info('%s...', message)
        begin = time.monotonic()
        yield
    finally:
        end = time.monotonic()
        logger.info('%s done. (%fs)', message, end - begin)


def run_inference(num_frames, on_loaded):
    """Yields (faces, (frame_width, frame_height)) tuples."""
    with CameraInference(face_detection.model()) as inference:
        on_loaded()
        for result in inference.run(num_frames):
            yield face_detection.get_faces(result), (result.width, result.height)


def threshold_detector(low_threshold, high_threshold):
    """Yields 'low', 'high', and None events."""
    assert low_threshold < high_threshold

    event = None
    prev_score = 0.0
    while True:
        score = (yield event)
        if score > high_threshold > prev_score:
            event = 'high'
        elif score < low_threshold < prev_score:
            event = 'low'
        else:
            event = None
        prev_score = score


def moving_average(size):
    window = collections.deque(maxlen=size)
    window.append((yield 0.0))
    while True:
        window.append((yield sum(window) / len(window)))


def average_joy_score(faces):
    if faces:
        return sum(face.joy_score for face in faces) / len(faces)
    return 0.0


def draw_rectangle(draw, x0, y0, x1, y1, border, fill=None, outline=None):
    assert border % 2 == 1
    for i in range(-border // 2, border // 2 + 1):
        draw.rectangle((x0 + i, y0 + i, x1 - i, y1 - i), fill=fill, outline=outline)


def scale_bounding_box(bounding_box, scale_x, scale_y):
    x, y, w, h = bounding_box
    return (x * scale_x, y * scale_y, w * scale_x, h * scale_y)


def svg_overlay(faces, frame_size, region, joy_score):
    width, height = frame_size
    doc = svg.Svg(width=width, height=height)

    rx, ry, rw, rh = region
    doc.add(svg.Rect(x=int(rx), y=int(ry), width=int(rw), height=int(rh), rx=10, ry=10,
                     style='fill:none;stroke:red;stroke-width:4px'))
    doc.add(svg.Text('Faces In Region: %d' % (len(faces)),
                     x=10, y=50, fill='red', font_size=40))

    for face in faces:
        x, y, w, h = face.bounding_box
        doc.add(svg.Rect(x=int(x), y=int(y), width=int(w), height=int(h), rx=10, ry=10,
                         fill_opacity=0.3 * face.face_score,
                         style='fill:red;stroke:white;stroke-width:4px'))

        doc.add(svg.Text('Joy: %.2f' % face.joy_score, x=x, y=y - 10,
                         fill='red', font_size=30))


    return str(doc)


class Service:

    def __init__(self):
        self._requests = queue.Queue()
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def _run(self):
        while True:
            request = self._requests.get()
            if request is None:
                self.shutdown()
                break
            self.process(request)
            self._requests.task_done()

    def process(self, request):
        pass

    def shutdown(self):
        pass

    def submit(self, request):
        self._requests.put(request)

    def close(self):
        self._requests.put(None)
        self._thread.join()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, exc_tb):
        self.close()


class Player(Service):
    """Controls buzzer."""

    def __init__(self, gpio, bpm):
        super().__init__()
        self._toneplayer = TonePlayer(gpio, bpm)

    def process(self, sound):
        self._toneplayer.play(*sound)

    def play(self, sound):
        self.submit(sound)


class Photographer(Service):
    """Saves photographs to disk."""

    def __init__(self, format, folder):
        super().__init__()
        assert format in ('jpeg', 'bmp', 'png')

        self._font = ImageFont.truetype(FONT_FILE, size=25)
        self._faces = ([], (0, 0))
        self._format = format
        self._folder = folder

    def _make_filename(self, timestamp, annotated):
        path = '%s/%s_annotated.%s' if annotated else '%s/%s.%s'
        return os.path.expanduser(path % (self._folder, timestamp, self._format))

    def _draw_face(self, draw, face, scale_x, scale_y):
        x, y, width, height = scale_bounding_box(face.bounding_box, scale_x, scale_y)
        text = 'Joy: %.2f' % face.joy_score
        _, text_height = self._font.getsize(text)
        margin = 3
        bottom = y + height
        text_bottom = bottom + margin + text_height + margin
        draw_rectangle(draw, x, y, x + width, bottom, 3, outline='white')
        draw_rectangle(draw, x, bottom, x + width, text_bottom, 3, fill='white', outline='white')
        draw.text((x + 1 + margin, y + height + 1 + margin), text, font=self._font, fill='black')

    def process(self, message):
        if isinstance(message, tuple):
            self._faces = message
            return

        camera = message
        timestamp = time.strftime('%Y-%m-%d_%H.%M.%S')

        stream = io.BytesIO()
        with stopwatch('Taking photo'):
            camera.capture(stream, format=self._format, use_video_port=True)

        filename = self._make_filename(timestamp, annotated=False)
        with stopwatch('Saving original %s' % filename):
            stream.seek(0)
            with open(filename, 'wb') as file:
                file.write(stream.read())

        faces, (width, height) = self._faces
        if faces:
            filename = self._make_filename(timestamp, annotated=True)
            with stopwatch('Saving annotated %s' % filename):
                stream.seek(0)
                image = Image.open(stream)
                draw = ImageDraw.Draw(image)
                scale_x, scale_y = image.width / width, image.height / height
                for face in faces:
                    self._draw_face(draw, face, scale_x, scale_y)
                del draw
                image.save(filename)

    def update_faces(self, faces):
        self.submit(faces)

    def shoot(self, camera):
        self.submit(camera)


class Animator(Service):
    """Controls RGB LEDs."""

    def __init__(self, leds):
        super().__init__()
        self._leds = leds

    def process(self, joy_score):
        if joy_score > 0:
            self._leds.update(Leds.rgb_on(Color.blend(JOY_COLOR, SAD_COLOR, joy_score)))
        else:
            self._leds.update(Leds.rgb_off())

    def shutdown(self):
        self._leds.update(Leds.rgb_off())

    def update_joy_score(self, joy_score):
        self.submit(joy_score)

# crops a face out of the picture and saves it to the disk.
def crop_face(image, image_format, image_folder, bounding_box):
    timestamp = time.strftime('%Y-%m-%d_%H.%M.%S')

    filename = os.path.expanduser('%s/%s.%s' % (image_folder, timestamp, image_format))
    with stopwatch('Saving Cropped %s' % filename):
        xi, yi, wi, hi = bounding_box
        #print('w: %d, h: %d, xi: %d, yi: %d, wi: %d, hi: %d' % (w, h, xi, yi, wi, hi))
        cropped_image = image.crop((xi, yi, (xi+wi), (yi+hi)))
        cropped_image.save(filename)
    return filename


# Incoming boxes are of the form (x, y, width, height). Scale and
# transform to the form (x1, y1, x2, y2).
def transform(bounding_box, scale_x, scale_y):
    x, y, width, height = bounding_box
    return (scale_x * x, scale_y * y, scale_x * (x + width),
            scale_y * (y + height))


# Both incoming boxes and the user defined region are of the form (x, y, width, height).
# Determines whether the face is entering or exiting the region.
def get_status(bounding_box, region_center, enter_side):
    face_center = (bounding_box[0] + bounding_box[2]/2, bounding_box[1] + bounding_box[3]/2)
    if enter_side == 2:         # In dual mode operation, 2 is used for the camera that monitors entering (True)
        return True
    if enter_side == 3:
        return False            # In dual mode operation, 3 is used for the camera that monitors the exiting (False)

    # In single mode operation, divide the region box and specify which side is entering (True) and exiting (False)
    if face_center[0] > region_center[0]:
        if enter_side == 0:     # 0 indicates Right side of the region box is entering
            return True
        else:                   # 1 indicates Left side of the region box is exiting.
            return False
    else:
        if enter_side == 0:  #
            return False
        else:
            return True

def preview_alpha(string):
    value = int(string)
    if value < 0 or value > 255:
        raise argparse.ArgumentTypeError('Must be in [0...255] range.')
    return value

# Refresh the access token using the refresh token
def refresh_access_token(url, refresh_token):
    headers = {'Content-type': 'application/json'}
    refresh_token_url = url + "/api/token/refresh/"
    parameters = {'refresh': refresh_token}
    r = requests.post(refresh_token_url, data=json.dumps(parameters), headers=headers)
    return r.json()

# Connect to web server and retrieve access and refresh tokens
def connect_to_server(url, user_name, password):
    get_token_url = url + "/api/token/"

    headers = {'Content-type': 'application/json'}

    parameters = {'username':user_name, 'password':password}

    r=requests.post(get_token_url, data=json.dumps(parameters), headers=headers)

    return r.json() # returns a json containing the access and refresh tokens.

# Sends a face to the cloud for classification:
def send_face(url, face, access_token, bus):
    headers={'Authorization':'access_token {}'.format(access_token)}

    data = {'enter': face[1], 'bus':bus}

    files = {'picture':  open(face[0], 'rb')}

    r = requests.post(url, headers=headers, files=files, data=data)

    print(r.json())

def monitor_run(num_frames, preview_alpha, image_format, image_folder,
                enable_streaming, streaming_bitrate, mdns_name,
                width, height, fps, region, enter_side, use_annotator, url, uname, pw, image_dir, bus):

    # Sign the device in and get an access and a refresh token, if a password and username provided.
    access_token = None
    refresh_token = None
    tokens = None
    start_token_timer = timer()
    if uname is not None and pw is not None:
        try:
            tokens = connect_to_server(url, uname, pw)
            access_token = tokens['access']
            refresh_token = tokens['refresh']
            print(access_token)
            print(refresh_token)
        except:
            print("Could not get tokens from the server.")
            pass

    # location where we want to send the faces + status for classification on web server.
    classification_path = url + "/" + image_dir

    done = threading.Event()
    def stop():
        logger.info('Stopping...')
        done.set()

    # Get the region center point and two corners
    r_center = (region[0] + region[2] / 2, region[1] + region[3] / 2)
    r_corners = (region[0], region[0] + region[2], region[1], region[1] + region[3])

    signal.signal(signal.SIGINT, lambda signum, frame: stop())
    signal.signal(signal.SIGTERM, lambda signum, frame: stop())

    logger.info('Starting...')
    with contextlib.ExitStack() as stack:
        leds = stack.enter_context(Leds())
        board = stack.enter_context(Board())
        player = stack.enter_context(Player(gpio=BUZZER_GPIO, bpm=10))
        photographer = stack.enter_context(Photographer(image_format, image_folder))
        animator = stack.enter_context(Animator(leds))
        # Forced sensor mode, 1640x1232, full FoV. See:
        # https://picamera.readthedocs.io/en/release-1.13/fov.html#sensor-modes
        # This is the resolution inference run on.
        # Use half of that for video streaming (820x616).
        camera = stack.enter_context(PiCamera(sensor_mode=4, framerate=fps, resolution=(width, height)))
        stack.enter_context(PrivacyLed(leds))

        # Annotator renders in software so use a smaller size and scale results
        # for increased performace.
        annotator = None
        if use_annotator:
            annotator = Annotator(camera, dimensions=(320, 240))
            scale_x = 320 / width
            scale_y = 240 / height

        server = None
        if enable_streaming:
            server = stack.enter_context(StreamingServer(camera, bitrate=streaming_bitrate,
                                                         mdns_name=mdns_name))

        def model_loaded():
            logger.info('Model loaded.')
            player.play(MODEL_LOAD_SOUND)

        def take_photo():
            logger.info('Button pressed.')
            player.play(BEEP_SOUND)
            photographer.shoot(camera)

        if preview_alpha > 0:
            camera.start_preview(alpha=preview_alpha)

        board.button.when_pressed = take_photo

        joy_moving_average = moving_average(10)
        joy_moving_average.send(None)  # Initialize.
        joy_threshold_detector = threshold_detector(JOY_SCORE_LOW, JOY_SCORE_HIGH)
        joy_threshold_detector.send(None)  # Initialize.

        previous_faces = []
        num_faces = 0
        for faces, frame_size in run_inference(num_frames, model_loaded):

            # If 4 mins have passed since access token obtained, refresh the token.
            end_token_timer = timer() # time in seconds
            if refresh_token is not None and end_token_timer - start_token_timer >= 240:
                tokens = refresh_access_token(url, refresh_token)
                access_token = tokens["access"]

            photographer.update_faces((faces, frame_size))
            joy_score = joy_moving_average.send(average_joy_score(faces))
            animator.update_joy_score(joy_score)
            event = joy_threshold_detector.send(joy_score)
            if event == 'high':
                logger.info('High joy detected.')
                player.play(JOY_SOUND)
            elif event == 'low':
                logger.info('Low joy detected.')
                player.play(SAD_SOUND)

            num_previous_faces = num_faces

            if use_annotator:
                annotator.clear()
                annotator.bounding_box(transform(region, scale_x, scale_y), fill=0)

            num_faces = 0
            tmp_arr = []
            faces_in_region = []
            photo_taken = False
            image = None
            for face in faces:
                face_center = (face.bounding_box[0] + face.bounding_box[2] / 2,
                               face.bounding_box[1] + face.bounding_box[3] / 2)

                # check if the center of the face is in our region of interest:
                if r_corners[0] <= face_center[0] <= r_corners[1] and \
                        r_corners[2] <= face_center[1] <= r_corners[3]:

                    if not photo_taken:
                        stream = io.BytesIO()
                        with stopwatch('Taking photo'):
                            camera.capture(stream, format=image_format, use_video_port=True)
                        stream.seek(0)
                        image = Image.open(stream)
                        photo_taken = True

                    num_faces = num_faces + 1
                    faces_in_region.append(face)

                    # creates a tuple ( image of the face, entering/exiting status)
                    tmp_arr.append([crop_face(image, image_format, image_folder, face.bounding_box), get_status(face.bounding_box, r_center, enter_side)])
                    if use_annotator:
                        annotator.bounding_box(transform(face.bounding_box, scale_x, scale_y),
                                               fill=0)  # draw a box around the face

            if server:
                server.send_overlay(svg_overlay(faces_in_region, frame_size, region, joy_score))

            if use_annotator:
                annotator.update()

            if num_faces < num_previous_faces:
                # loop through previous faces: send face data, image and status
                print(" A face left the region: send previous face data")
                #if not use_annotator:
                    #take_photo()

                for face in previous_faces:
                    print(classification_path, face, access_token)
                    if access_token is not None:
                        print("sent face with access token")
                        send_face(classification_path, face, access_token,bus)

            previous_faces = tmp_arr

            if done.is_set():
                break


def main():
    logging.basicConfig(level=logging.INFO)

    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--num_frames', '-n', type=int, default=None,
                        help='Number of frames to run for')
    parser.add_argument('--preview_alpha', '-pa', type=preview_alpha, default=0,
                        help='Video preview overlay transparency (0-255)')
    parser.add_argument('--image_format', default='jpeg',
                        choices=('jpeg', 'bmp', 'png'),
                        help='Format of captured images')
    parser.add_argument('--image_folder', default='tmpImage',
                        help='Folder to save captured images')
    parser.add_argument('--blink_on_error', default=False, action='store_true',
                        help='Blink red if error occurred')
    parser.add_argument('--enable_streaming', default=True, action='store_true',
                        help='Enable streaming server')
    parser.add_argument('--streaming_bitrate', type=int, default=1000000,
                        help='Streaming server video bitrate (kbps)')
    parser.add_argument('--mdns_name', default='',
                        help='Streaming server mDNS name')

    parser.add_argument('--cam_width', type=int, default=1640,
                        help='Camera Width')
    parser.add_argument('--cam_height', type=int, default=1232,
                        help='Camera Height')
    parser.add_argument('--fps', type=int, default=30,
                        help='Camera Frames Per Second')
    parser.add_argument('--region', nargs=4, type=int, default=[504,632, 632, 632],
                        help='Region for entering/exiting face detection: x, y, width, height')
    parser.add_argument('--enter_side', type=int, default=2,
                        help='Used to determine which side of the region should be considered "entering": 0 = right, 1 = left'
                             'Or in dual camera operation: 2 = entering, 3 = Exiting')
    parser.add_argument('--annotator', default=False,
                        help='Shows the annotator overlay, however disables camera snapshots.')
    parser.add_argument('--url', default="http://10.8.0.6:8000",
                        help='Url to send the face captures that are taken.')
    parser.add_argument('--username', default="device-entering",
                        help='User name used to authenticate this device initially')
    parser.add_argument('--password', default="Temp12345",
                        help='Password used to authenticate this device initially')
    parser.add_argument('--image_dir', default="events/",
                        help='{url + "/" + image_dir} will give us path to send the face data')
    parser.add_argument('--bus', default="1",
                        help='Specify the bus number this devices is on')
    args = parser.parse_args()

    try:
        monitor_run(args.num_frames, args.preview_alpha, args.image_format, args.image_folder,
                    args.enable_streaming, args.streaming_bitrate, args.mdns_name,
                    args.cam_width, args.cam_height, args.fps, args.region, args.enter_side,
                    args.annotator, args.url, args.username, args.password, args.image_dir, args.bus)
    except KeyboardInterrupt:
        pass
    except Exception:
        logger.exception('Exception while running joy demo.')
        if args.blink_on_error:
            with Leds() as leds:
                leds.pattern = Pattern.blink(100)  # 10 Hz
                leds.update(Leds.rgb_pattern(Color.RED))
                time.sleep(1.0)

    return 0

if __name__ == '__main__':
    sys.exit(main())
