# Author: Miguel Millan
# class: CSI4999 
import io
import datetime
import time
import random
import picamera

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
camera.resolution = (640,480)
stream = picamera.PiCameraCircularIO(camera, seconds=60)
camera.start_recording(stream, format=codec)

if testing:
    camera.start_preview()

try:
    while True:
        camera.wait_recording(1)
        print(camera.frame)
        if change_detected():
            # generate a timestamp to use for the file name
            timestamp = datetime.datetime.now()
            
            # temporary, keep recording for 10 seconds and only then write the stream to disk
            camera.wait_recording(10)
            filename=path+"{}.".format(timestamp.strftime(timeformat))+extension
           
            stream.copy_to(filename)
            break #temporary, for now just want one recording, then stop

finally:
    if testing:
        camera.stop_preview()
    camera.stop_recording()
