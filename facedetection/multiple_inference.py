#!/usr/bin/env python3


"""Camera inference face detection demo code.

Runs continuous face detection on the VisionBonnet and prints the number of
detected faces.

Example:
face_detection_camera.py --num_frames 10
"""
import argparse

from picamera import PiCamera

from aiy.vision.inference import CameraInference
from aiy.vision.models import object_detection
from aiy.vision.models import face_detection
from aiy.vision.annotator import Annotator


def avg_joy_score(faces):
    if faces:
        return sum(face.joy_score for face in faces) / len(faces)
    return 0.0

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
    args = parser.parse_args()

    # Forced sensor mode, 1640x1232, full FoV. See:
    # https://picamera.readthedocs.io/en/release-1.13/fov.html#sensor-modes
    # This is the resolution inference run on.
    with PiCamera(sensor_mode=4, resolution=(args.cam_width, args.cam_height), framerate=args.fps) as camera:
        camera.start_preview()
        
        width = args.cam_width
        height = args.cam_height

        # Annotator renders in software so use a smaller size and scale results
        # for increased performace.
        annotator = Annotator(camera, dimensions=(320, 240))
        scale_x = 320 / width
        scale_y = 240 / height
        
        size = min(width, height)
        offset = (((width - size) / 2), ((height - size) / 2))

        # Incoming boxes are of the form (x, y, width, height). Scale and
        # transform to the form (x1, y1, x2, y2).
        def transform(bounding_box):
            x, y, width, height = bounding_box
            return (scale_x * x, scale_y * y, scale_x * (x + width),
                    scale_y * (y + height))
        while True:
            with CameraInference(face_detection.model()) as inference, \
                 CameraInference(object_detection.model()) as inference2:
                
                for result in inference.run(args.num_frames):
                    faces = face_detection.get_faces(result)
                    annotator.clear()
                    for face in faces:
                        annotator.bounding_box(transform(face.bounding_box), fill=0)
                    #annotator.update()

                    print('#%05d (%5.2f fps): num_faces=%d, avg_joy_score=%.2f' %
                        (inference.count, inference.rate, len(faces), avg_joy_score(faces)))
                    
                for result in inference2.run(args.num_frames):
                    objects = object_detection.get_objects(result, args.threshold, offset)
                    
                    #annotator.clear()
                    for i, obj in enumerate(objects):
                        annotator.bounding_box(transform(obj.bounding_box), fill=0)
                        print('Object #%d: %s' % (i, obj))
                
                    annotator.update()

        camera.stop_preview()


if __name__ == '__main__':
    main()

