# Author: Miguel Millan
# class: CSI4999 
import io
import datetime
import time
import random
import picamera
import argparse
import warnings
import json
from picamera.array import PiRGBArray

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-c", "--conf", required=True, help="path to the JSON configuration file")
args = vars(ap.parse_args())

# filter warnings, and load the configuration
warnings.filterwarnings("ignore")
conf = json.load(open(args["conf"]))


path="../output/"
codec="h264"
extension="mpeg"
timeformat="%Y%m%d-%H%M%S"
testing=1 # set 1 = true, 0 = false


def change_detected():
    # At the moment we'll use random numbers to simulate event detected.
    # return random.randint(0,10) == 0
    return 1


camera = picamera.PiCamera()
camera.resolution = tuple(conf["RES"])
stream = picamera.PiCameraCircularIO(camera, seconds=60)
camera.start_recording(stream, format=conf["CODEC"])

if testing:
    camera.start_preview()

try:
    while True:
        print(camera.frame)
        if change_detected():
            # generate a timestamp to use for the file name
            timestamp = datetime.datetime.now()
            
            # temporary, keep recording for 10 seconds and only then write the stream to disk
            camera.wait_recording(10)
            filename = conf["OUTPATH"]+"{}.".format(timestamp.strftime(conf["TIMEFORMAT"]))+conf["EXTENSION"]
           
            stream.copy_to(filename)
            break #temporary, for now just want one recording, then stop

finally:
    if testing:
        camera.stop_preview()
    camera.stop_recording()
