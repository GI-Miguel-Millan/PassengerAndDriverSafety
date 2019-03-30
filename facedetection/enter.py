#!/usr/bin/env python3


"""Camera inference face detection demo code.

Runs continuous face detection on the VisionBonnet and prints the number of
detected faces.

Example:
face_detection_camera.py --num_frames 10
"""
import argparse
import io

from time import sleep
from picamera import PiCamera
from PIL import Image, ImageDraw
from aiy.vision.inference import CameraInference
from aiy.vision.models import object_detection
from aiy.vision.models import face_detection
from aiy.vision.annotator import Annotator


def avg_joy_score(faces):
    if faces:
        return sum(face.joy_score for face in faces) / len(faces)
    return 0.0

def crop_face(camera, bounding_box):
    # TODO take a picture and crop the face out of it.
    return None

def main():
    """Face detection camera inference example."""
    parser = argparse.ArgumentParser()
    parser.add_argument('--num_frames', '-n', type=int, dest='num_frames', default=None,
        help='Sets the number of frames to run for, otherwise runs forever.')
    parser.add_argument('--sparse', '-s', action='store_true', default=False,
                        help='Use sparse tensors.')
    parser.add_argument('--threshold', '-t', type=float, default=0.3,
                        help='Detection probability threshold.')
    parser.add_argument('--cam_width', type=int, default=1640,
                        help='Camera Width')
    parser.add_argument('--cam_height', type=int, default=1232,
                        help='Camera Height')
    parser.add_argument('--fps', type=int, default=30,
                        help='Camera Frames Per Second')
    parser.add_argument('--region', nargs=4, type=int, default=[1040,600, 600, 632],
                        help='Region for entering/exiting face detection: x, y, width, height')
    parser.add_argument('--enter_side', type=int, default=1,
                        help='Used to determine which side of the region should be considered "entering": 1 = right, 0 = left')
    args = parser.parse_args()
    
    # Forced sensor mode, 1640x1232, full FoV. See:
    # https://picamera.readthedocs.io/en/release-1.13/fov.html#sensor-modes
    # This is the resolution inference run on.
    with PiCamera(sensor_mode=4, resolution=(args.cam_width, args.cam_height), framerate=args.fps) as camera:
        camera.start_preview()

        # Get the camera width and height
        width = args.cam_width
        height = args.cam_height

        # Get the region center point and two corners
        r_center = (args.region[0] + args.region[2] / 2, args.region[1] + args.region[3]/2)
        r_corners = (args.region[0], args.region[0] + args.region[2], args.region[1], args.region[1] + args.region[3])

        # Annotator renders in software so use a smaller size and scale results
        # for increased performace.
        annotator = Annotator(camera, dimensions=(320, 240))
        scale_x = 320 / width
        scale_y = 240 / height


        # Incoming boxes are of the form (x, y, width, height). Scale and
        # transform to the form (x1, y1, x2, y2).
        def transform(bounding_box):
            x, y, width, height = bounding_box
            return (scale_x * x, scale_y * y, scale_x * (x + width),
                    scale_y * (y + height))


        # Both incoming boxes and the user defined region are of the form (x, y, width, height).
        # Determines whether the face is entering or exiting the region.
        def get_status(bounding_box):
            face_center = (bounding_box[0] + bounding_box[2]/2, bounding_box[1] + bounding_box[3]/2)
            if face_center[0] > r_center[0]:
                if args.enter_side == 0:
                    return True
                else:
                    return False
            else:
                if args.enter_side == 0:
                    return False
                else:
                    return True


        previous_faces = []
        num_previous_faces = 0
        num_faces = 0
        faces = []
        stream = io.BytesIO()
        with CameraInference(face_detection.model()) as inference:

            for result in inference.run(args.num_frames):
                # get the frame as a picture 

                num_previous_faces = num_faces
                faces = face_detection.get_faces(result)

                annotator.clear()    
                annotator.bounding_box(transform(args.region), fill=0)
                
                num_faces = 0
                tmp_arr = []
                for face in faces:
                    face_center = (face.bounding_box[0] + face.bounding_box[2]/2, face.bounding_box[1] + face.bounding_box[3]/2)
                    
                    # check if the center of the face is in our region of interest:
                        
                    annotator.bounding_box(transform(face.bounding_box), fill=0) # draw a box around the face 


                annotator.update()

        camera.stop_preview()


if __name__ == '__main__':
    main()


