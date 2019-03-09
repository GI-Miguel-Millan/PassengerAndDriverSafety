# Author: Miguel Millan

# Streams the camera, comparing frames until a change is detected, then records a ten second clip.

# import necessary packages
from picamera.array import PiRGBArray
from picamera import PiCamera
import argparse
import warnings
import json
import datetime
import imutils
import time
import cv2
import numpy as np
import sys
import collections
import _thread
import threading
import SaveVideoThread as svt

# Construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-c", "--conf", required=True, help="path to the JSON configuration file")
args = vars(ap.parse_args())

#filter warnings, and load the configuration
warnings.filterwarnings("ignore")
conf = json.load(open(args["conf"]))

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
RES=tuple(conf["RES"])
FPS=conf["FPS"]
RECFPS=conf["RECFPS"]
CAM_WARMUP=conf["CAM_WARMUP"]
DELTA_THRESH=conf["DELTA_THRESH"]
SHOW_VIDEO=conf["SHOW_VIDEO"] # 1=TRUE
MIN_AREA=conf["MIN_AREA"]
OUTPATH = conf["OUTPATH"]
PRIOR_DETECTION_FRAMES = conf["PRIOR_DETECTION_FRAMES"] # number of frames to save before motion detected
AFTER_DETECTION_FRAMES = conf["AFTER_DETECTION_FRAMES"] # number of frames to save after motion detected
CODEC=conf["CODEC"]
EXTENSION=conf["EXTENSION"]
TIMEFORMAT=conf["TIMEFORMAT"]

# initialize the camera and grab a reference to the raw camera capture
camera = PiCamera()
camera.resolution = RES
camera.framerate = FPS
rawCapture = PiRGBArray(camera, size=RES)

# camera warmup, initalize average frame,
# last frame timestamp, 
print("warming up")
time.sleep(CAM_WARMUP)
avg = None
lastUploaded = datetime.datetime.now()

# Inialize tracking variables
recording = 0 # control variable, 0 = not recording, 1 = recording
frameBuffer = collections.deque() #used to store frames for writing to video
motionDetected = 0 # 0 = motion was detected in the frame, 1 = no motion
detectedCounter = AFTER_DETECTION_FRAMES # tracks number of frames after
saveCounter = 0 # tracks number of frames before
wasRecorded = 0 # 1 = the video was recording and has frames to write
savingInProgress = 0
threadID = 1 # each video saving thread spawned has a threadID associated
threads = [] # stores references to threads

# capture frames from the camera
for f in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
    # grab the raw NumPy array representing the image and initialize
    # the timestamp and occupied/unoccupied text
    frame = f.array
    timestamp = datetime.datetime.now()
    text = "Unoccupied"
    motionDetected = 0
    saveframe = frame # want to keep an unmodified frame for saving video

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
    #print("framedelta: {}".format(frameDelta))
    #print("avg: {}".format(avg))
    
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
        motionDetected = 1

    # draw the text and timestamp on the frame
    ts = timestamp.strftime("%A %d %B %Y %I:%M:%S%p")
    cv2.putText(frame, "Room Status: {}".format(text), (10,20), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
    cv2.putText(frame, ts, (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX,
            0.35, (0, 0, 255), 1)
    
    saveframe = thresh
    #
    # Put code for storing video if enough motion frames
    if motionDetected :
        if recording : 
            frameBuffer.append(saveframe)
            detectedCounter = AFTER_DETECTION_FRAMES
        else:
            recording = 1 # start recording
            frameBuffer.append(saveframe)
            wasRecorded = 1
    else:
        if wasRecorded :
            frameBuffer.append(saveframe)
            detectedCounter -= 1

            if detectedCounter == 0: # we've up to the max AFTER MOTION frames 
                # create filepath, write video and reset control variables
                path = OUTPATH+"{}.".format(timestamp.strftime(TIMEFORMAT))+EXTENSION
                recording = 0
                detectedCounter = AFTER_DETECTION_FRAMES
                saveCounter = 0
                wasRecorded = 0
                tmpframeBuffer = frameBuffer
                frameBuffer = collections.deque()
                # Run the video saving script in a new thread
                #_thread.start_new_thread(record_video, (tmpframeBuffer, path, CODEC, FPS, RES))
                
                # must wait for video script to finish
                #record_video(tmpframeBuffer, path, CODEC, FPS, RES)

                # Create a new thread, start it, save its reference, increment the threadID.
                thread = svt.SaveVideoThread(threadID,tmpframeBuffer, path, CODEC, RECFPS,RES)
                thread.start()
                threads.append(thread)
                threadID += 1

        else :
            if saveCounter < PRIOR_DETECTION_FRAMES :
                frameBuffer.append(saveframe)
                saveCounter += 1
            else: 
                try:
                    frameBuffer.popleft()
                    frameBuffer.append(saveframe)
                except IndexError:
                    print("error while dequeing")

    #
    
    # check to see if the frames should be displayed to the screen
    if SHOW_VIDEO :
        # display the security feed
        cv2.imshow("Security Feed", thresh)
        key = cv2.waitKey(1) & 0xFF

        # if the 'q' key is pressed, break from the loop
        if key == ord("q") :
            # wait for all threads to complete before exiting.
            for t in threads:
                t.join()
            break

    #clear the stream in preparation for the next frame
    rawCapture.truncate(0)


