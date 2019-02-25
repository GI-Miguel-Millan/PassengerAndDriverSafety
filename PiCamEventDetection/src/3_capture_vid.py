#Author: Miguel Millan

# Class for capturing video once triggered (by motion detected) and saving it to a file (a few seconds after motion has stopped).

from picamera.array import PiRGBArray
from picamera import PiCamera
import datetime
import imutils
import time
import cv2
import numpy as np
import sys

class CaptureVid:

    detected = 0
    camera = None
    path = None
    extension = ""

    def __init__(self, cam_ref, basePath="./", ext=".mpeg"):
       camera = cam_ref
       path = basePath
       extension = ext

    def check
