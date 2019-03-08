# Author: Miguel Millan

# Streams the camera, comparing frames until a change is detected, then records a ten second clip.

# import necessary packages
from picamera.array import PiRGBArray
from picamera import PiCamera
import datetime
import imutils
import time
import cv2
import numpy as np
import sys


# Re-written function from the imutils library in order to avoid 
# the Illegal Instruction Error I was getting
# 
def resize(image, width=None, height=None, inter=cv2.INTER_AREA):
    dim=None
    (h,w)=image.shape[:2]
    
    if width is None and height is None:
        return image
    if width is None:
        r=height/float(h)
        dim=(int(w*r),height)
    else:
        r=width/float(w)
        dim=(width,int(h*r))


    resized=cv2.resize(image, dim, inter) # Here we changed interpolation=inter to just inter.
    return resized    

#constants:
RES=tuple([640,480])
FPS=20
CAM_WARMUP=2.5
DELTA_THRESH=5
SHOW_VIDEO=1 # TRUE
MIN_UPLOAD_SECONDS=3.0
MIN_MOTION_FRAMES=10
MIN_AREA=5000

# initialize the camera and grab a reference to the raw camera capture
camera = PiCamera()
camera.resolution = RES
camera.framerate = FPS
rawCapture = PiRGBArray(camera, size=RES)

# camera warmup, initalize average frame,
# last frame timestamp, and frame motion counter
print("warming up")
time.sleep(CAM_WARMUP)
avg = None
lastUploaded = datetime.datetime.now()
motionCounter = 0

# capture frames from the camera
for f in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
    # grab the raw NumPy array representing the image and initialize
    # the timestamp and occupied/unoccupied text
    frame = f.array
    timestamp = datetime.datetime.now()
    text = "Unoccupied"
    
    # resize the frame, convert it to grayscale, and blur it
    frame = resize(frame, width=500)
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (21,21),0) # to remove high frequence noise (focus on "structural" objects)

    # If the average frame is None, initialize it
    if avg is None:
        print("starting background model...")
        avg = gray.copy().astype("float")
        rawCapture.truncate(0)
        continue

    # accumulate the weighted average between the current frame and 
    # previous frames, then compute the difference between the current 
    # frame and running average
    cv2.accumulateWeighted(gray, avg, 0.5)
    frameDelta = cv2.absdiff(gray, cv2.convertScaleAbs(avg)) # delta = |background_model - current_frame|
    print("framedelta: {}".format(frameDelta))
    print("avg: {}".format(avg))
    
    # Threshold the delta image, dilate the thresholded image to fill
    # in the holes, then find contours on thresholded image
    thresh = cv2.threshold(frameDelta,DELTA_THRESH, 255, cv2.THRESH_BINARY)[1]
    thresh = cv2.dilate(thresh, None, iterations=2)
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    
    # loop over the contours
    for c in cnts:
        # if the contour is too small, ignore it
        if cv2.contourArea(c) < MIN_AREA :
            continue

        # compute the bounding box for the contour, draw it on the frame,
        # and update the text
        (x,y,w,h) = cv2.boundingRect(c)
        cv2.rectangle(frame, (x,y), (x+w, y+h), (0, 255, 0), 2)
        text = "Occupied"

    # draw the text and timestamp on the frame
    ts = timestamp.strftime("%A %d %B %Y %I:%M:%S%p")
    cv2.putText(frame, "Room Status: {}".format(text), (10,20), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
    cv2.putText(frame, ts, (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX,
            0.35, (0, 0, 255), 1)
    # 
    #
    # Put code for storing video if enought motion frames
    # 
    #
    
    # check to see if the frames should be displayed to the screen
    if SHOW_VIDEO :
        # display the security feed
        cv2.imshow("Security Feed", frame)
        key = cv2.waitKey(1) & 0xFF

        # if the 'q' key is pressed, break from the loop
        if key == ord("q"):
            break

    #clear the stream in preparation for the next frame
    rawCapture.truncate(0)


