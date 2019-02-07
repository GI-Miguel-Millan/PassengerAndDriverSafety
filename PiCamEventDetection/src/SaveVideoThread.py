# Author: Miguel Millan

# Class that will save a set of frames to a video using a different thread of execution.

import threading
import cv2
import numpy as np
import time


class SaveVideoThread (threading.Thread):
    def __init__(self, threadID, dequeue, filepath, codec, fps, resolution):
        threading.Thread.__init__(self)
        self.frames = dequeue
        self.path = filepath
        self.codec = codec
        self.fps = fps
        self.res = resolution

    def run(self):
        print("Recording video: "+self.path)
        record_video(self.frames, self.path, self.codec, self.fps, self.res)
        print("Finish Recording video: "+self.path)

# Record the video frames stored in a deque to an output file name.
#
# @param frames - a dequeue of frames 
# @param filepath - path and file name of the output video
# @param codec - fourcc video codec to encode the video as.
# @param fps - frames per second
# @param resolution - a tuple (width, height) representing the resolution of the frames.
#
def record_video(frames, filepath, codec, fps, resolution):
        # Define the codec and create VideoWriter object
        fourcc = cv2.VideoWriter_fourcc(*codec) 
        videowriter = cv2.VideoWriter(filepath, fourcc, fps, resolution)
        i = 1   
        while True:
            try:
                # It is assumed the frames are chronolically queued from the right
                videowriter.write(frames.popleft())
                print("wrote a frame: {}".format(i))
                i += 1
            except IndexError:
                break

        videowriter.release()
                                                                            

