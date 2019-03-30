# Author: Miguel Millan

# Description: 
# Creates / formats the LFW Face Dataset for training face recognition.

# Ensure that you've:
# 1. Downloaded opencv face detection:
#   https://github.com/spmallick/learnopencv/blob/master/FaceDetectionComparison/models/res10_300x300_ssd_iter_140000_fp16.caffemodel
# 2. Downloaded the dataset: 
#   http://vis-www.cs.umass.edu/lfw/lfw-deepfunneled.tgz
# 3. Structured your project like so:
# <project root>
#   |--- preprocess.py
#   |--- retrain.py
#   |--- Input/
#   |      |--- lfw-deepfunneled.tgz
#   |      |--- res10_300x300_ssd_iter_140000_fp16.caffemodel

# Adapted from: https://www.kaggle.com/saidakbarp/face-recognition-part-1/notebook
# Original Author: Saidakbar P

import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
#Visiulazation
import matplotlib.pyplot as plt
#image processing
import cv2
#extracting zippped file
import tarfile
#systems
import os
#remove unused folders
import shutil
from numpy import random
from PIL import Image
from object_detection.utils import dataset_util
import tensorflow as tf


def show_image(image):
    plt.figure(figsize=(8,5))
    #Before showing image, bgr color order transformed to rgb order
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    plt.xticks([])
    plt.yticks([])
    plt.show()

#function to extract box dimensions
def face_dnn(img, net, coord=False):
    blob = cv2.dnn.blobFromImage(img, 1, (224,224), [104, 117, 123], False, False) #
    # params: source, scale=1, size=300,300, mean RGB values (r,g,b), rgb swapping=false, crop = false
    conf_threshold=0.8 # confidence at least 60%
    frameWidth=img.shape[1] # get image width
    frameHeight=img.shape[0] # get image height
    max_confidence=0
    net.setInput(blob)
    detections = net.forward()
    detection_index=0
    bboxes = []
    
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            
            if max_confidence < confidence: # only show maximum confidence face
                max_confidence = confidence
                detection_index = i
    i=detection_index        
    x1 = int(detections[0, 0, i, 3] * frameWidth)
    y1 = int(detections[0, 0, i, 4] * frameHeight)
    x2 = int(detections[0, 0, i, 5] * frameWidth)
    y2 = int(detections[0, 0, i, 6] * frameHeight)
    cv2.rectangle(img,(x1,y1),(x2,y2),(255,255,0),2)
    cv_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    if coord==True:
        return x1, y1, x2, y2
    return cv_rgb

#gray=cv2.cvtColor(img,cv2.COLOR_RGB2GRAY)
# multiple faces needs increasing the size of image as well as multiple detections
def nfaces_dnn(img, net):
    blob = cv2.dnn.blobFromImage(img, 1.2, (1200,1200), [104, 117, 123], False, False) #
    # params: source, scale=1, size=300,300, mean RGB values (r,g,b), rgb swapping=false, crop = false
    conf_threshold=0.6 # confidence at least 60%
    frameWidth=img.shape[1] # get image width
    frameHeight=img.shape[0] # get image height
    net.setInput(blob)
    detections = net.forward()

    bboxes = []

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:

            x1 = int(detections[0, 0, i, 3] * frameWidth)
            y1 = int(detections[0, 0, i, 4] * frameHeight)
            x2 = int(detections[0, 0, i, 5] * frameWidth)
            y2 = int(detections[0, 0, i, 6] * frameHeight)
            cv2.rectangle(img,(x1,y1),(x2,y2),(255,255,0),2)
    cv_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    return cv_rgb

def jpg_files(members): #only extract jpg files
    for tarinfo in members:
        if os.path.splitext(tarinfo.name)[1] == ".jpg":
            yield tarinfo

def untar(fname,path="LFW"): #untarring the archive
    tar = tarfile.open(fname)
    tar.extractall(path,members=jpg_files(tar))
    tar.close()
    if path is "":
        print("File Extracted in Current Directory")
    else:
        print("File Extracted in to",  path)

# function for creating box labels as txt file
def label_txt(pathdr, lab_dir):
    for fol in os.listdir(pathdr):
        tfile = open(lab_dir+fol+".txt","w+")
        for img in os.listdir(pathdr+fol):
            pathimg=os.path.join(pathdr+fol, img)
            #print(pathimg)
            pic=cv2.imread(pathimg)
            x1, y1, x2, y2=face_dnn(pic, True) # face detection and then saving into txt file
            tfile.write(img+' '+str(x1)+' '+str(x2)+' '+str(y1)+' '+str(y2)+'\n')
        tfile.close()
    print('Saved')

def read_txt(person, photo, labels):
    txtfile = labels+person+".txt"
    txtfile_contents = open(txtfile, "r")
    txtlines = txtfile_contents.readlines()
    txtfile_contents.close()
    for line in txtlines:
        if photo in line:
            txtlines=line
    return txtlines

# flags = tf.app.flags
# flags.DEFINE_string('output_path', '', 'Path to output TFRecord')
# FLAGS = flags.FLAGS
# modified from source: https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/using_your_own_dataset.md
def create_tf_example(photo, person, iclass, foldr, lbl):
    # one image at a time
    img_f=os.path.join(foldr+person,photo+".jpg")
    pic = Image.open(img_f)
    height = pic.height # Image height
    width = pic.width # Image width
    filename = str.encode(photo) # Filename of the image. Empty if image is not from file
    #encoded_image_data = None # Encoded image bytes
    image_data = tf.gfile.GFile(img_f,'rb').read()
    
    image_format = b'jpeg' #None #  or b'png'
    #declare coordinates
    xmins = [] # List of normalized left x coordinates in bounding box (1 per box)
    xmaxs = [] # List of normalized right x coordinates in bounding box
             # (1 per box)
    ymins = [] # List of normalized top y coordinates in bounding box (1 per box)
    ymaxs = [] # List of normalized bottom y coordinates in bounding box
             # (1 per box)
    classes_text = [] # List of string class name of bounding box (1 per box)
    classes = [] # List of integer class id of bounding box (1 per box)
    
    txtlines = read_txt(person, photo, lbl)

    labels = txtlines.split()

    xmins.append(float(labels[1])/width)
    xmaxs.append(float(labels[2])/width)
    ymins.append(float(labels[3])/height)
    ymaxs.append(float(labels[4])/height)

    classes_text.append(str.encode(person))
    classes.append(iclass) #### iterator is needed
    #print(xmins, xmaxs, ymins, ymaxs, classes_text, photo, img_f) # for test purposes
    tf_example = tf.train.Example(features=tf.train.Features(feature={
      'image/height': dataset_util.int64_feature(height),
      'image/width': dataset_util.int64_feature(width),
      'image/filename': dataset_util.bytes_feature(filename),
      'image/source_id': dataset_util.bytes_feature(filename),
      'image/encoded': dataset_util.bytes_feature(image_data),
      'image/format': dataset_util.bytes_feature(image_format),
      'image/object/bbox/xmin': dataset_util.float_list_feature(xmins),
      'image/object/bbox/xmax': dataset_util.float_list_feature(xmaxs),
      'image/object/bbox/ymin': dataset_util.float_list_feature(ymins),
      'image/object/bbox/ymax': dataset_util.float_list_feature(ymaxs),
      'image/object/class/text': dataset_util.bytes_list_feature(classes_text),
      'image/object/class/label': dataset_util.int64_list_feature(classes),
    }))
    return tf_example

#saving tfrecords
def save_tf(folder, lbl):
    tf_file=folder.split('/')[-2] +'.tfrecord'
    writer = tf.python_io.TFRecordWriter(tf_file)
    
    labelmap = 'object_label.pbtxt' # for model training
    txtf = open(labelmap, "w")
    
    labels = 'labels.txt' # for android deployment
    txtl = open(labels, "w")
    
    for ind, person in enumerate(os.listdir(folder)):
        iclass=ind+1
        txtf.write("item\n{\n  id: %s\n  name: '%s'\n}\n"%(iclass,person))
        txtl.write("%s\n"%person)
        #print(iclass, person)
        for photo in os.listdir(folder+person):
            tf_example = create_tf_example(photo.split('.')[0], person, iclass, folder, lbl) #004.jpg, arnold, 1
            #print('Folder:', pathd+fol, iclass)
            writer.write(tf_example.SerializeToString())
    txtf.close()
    writer.close()

def make_tarfile(output_filename, source_dir):
    with tarfile.open(output_filename, "w:gz") as tar:
        tar.add(source_dir, arcname=os.path.basename(source_dir))




def main():
    print(os.listdir("input"))
    #example
    #imgg="input/Aaron_Tippin_0001.jpg"
    #celeb=cv2.imread(imgg)
    #show_image(celeb)
    
    # using openCV DNN
    # load Model
    modelFile ="input/res10_300x300_ssd_iter_140000_fp16.caffemodel"
    configFile = "input/deploy.prototxt"
    net = cv2.dnn.readNetFromCaffe(configFile, modelFile)
    
    #a=face_dnn(celeb, net)
    #plt.imshow(a)
    #plt.show()

    #img=cv2.imread("input/people.png")
    #c=nfaces_dnn(img, net)
    #plt.figure(figsize=(15,18))
    #plt.imshow(c)
    #plt.show()

    fname='input/lfw-deepfunneled.tgz'
    untar(fname, "LFW")
    
    pathd = 'LFW/lfw-deepfunneled/'
    len(os.listdir(pathd)) # total number of folders (people)
    
    # total number of images
    total = sum([len(files) for r, d, files in os.walk(pathd)])
    print(total)

    count=0
    imglist=[]
    #
    for r, d, files in os.walk(pathd):
        if len(files)>=20:
            imglist.append(r)
            #print(count, r)
            count+=1 # counts how many folders have with at least 20 images
    print(count)

    #os.listdir(imglist[0])
    # pick one random photo
    a=np.random.randint(0,20)
    b=np.random.randint(0,62)
    imglist[b]

    # show the random photo with face detected
    img=imglist[b]+'/'+os.listdir(imglist[b])[a]
    img=cv2.imread(img)
    c=face_dnn(img,net)
    plt.imshow(c)
    plt.show()

    # Creating training/testing sets

    #shutil.rmtree(os.path.realpath('LFW'))
    for dirs in os.listdir(pathd):
        if not (pathd+dirs) in imglist:
            shutil.rmtree(os.path.realpath(pathd+dirs))

    dirs=os.listdir(pathd)
    dirs.sort()

    #example of box coordinates
    #a=np.random.randint(0,20)
    b=np.random.randint(0,62)
    for img in os.listdir(pathd+dirs[b])[:5]:
        #print(pathd+dirs[0]+'/'+img)
        print(dirs[b])
        img=cv2.imread(pathd+dirs[b]+'/'+img)
        x1, y1, x2, y2=face_dnn(img,net, True)
        #print coordinates of the detected face
        print(x1, y1, x2, y2)
        plt.imshow(img)
        plt.show()

    os.listdir('LFW')
    pathd
    
    datadir='LFW/'
    train=datadir+'train/'
    test=datadir+'test/'
    
    if not os.path.exists(train):
        os.mkdir(train)
    if not os.path.exists(test):
        os.mkdir(test)
    
    for dirs in os.listdir(pathd):
        filenames = os.listdir(pathd+dirs)
        filenames.sort()  # make sure that the filenames have a fixed order before shuffling
        random.seed(402)
        random.shuffle(filenames) # shuffles the ordering of filenames (deterministic given the chosen seed)
        split = int(0.85 * len(filenames))
        train_filenames = filenames[:split] # splitting filenames into two parts
        test_filenames = filenames[split:]
        for img in train_filenames:
            full_file_name = os.path.join(pathd+dirs, img)
            cur_dir=os.path.join(train+dirs)
            #print(cur_dir)
            if not os.path.exists(cur_dir): # create this current person's folder for training
                os.mkdir(cur_dir)
            shutil.copy(full_file_name, cur_dir)
        for img in test_filenames:
            full_file_name = os.path.join(pathd+dirs, img)
            cur_dir=os.path.join(test+dirs)
            if not os.path.exists(cur_dir): # create this current person's folder for testing
                os.mkdir(cur_dir)
            shutil.copy(full_file_name, cur_dir)
            #a=full_file_name+' '+test+dirs
    shutil.rmtree(pathd)

    # total number of images left
    total = sum([len(files) for r, d, files in os.walk(datadir)])
    print(total)
    
    labeldir="Labels/" # labels dir
    wdir="LFW/"
    lab=wdir+labeldir
    if not os.path.exists(lab):
        os.mkdir(lab)
    
    # function for creating box labels as txt file
    def label_txt(pathdr, lab_dir):
        for fol in os.listdir(pathdr):
            tfile = open(lab_dir+fol+".txt","w+")
            for img in os.listdir(pathdr+fol):
                pathimg=os.path.join(pathdr+fol, img)
                #print(pathimg)
                pic=cv2.imread(pathimg)
                x1, y1, x2, y2=face_dnn(pic,net, True) # face detection and then saving into txt file
                tfile.write(img+' '+str(x1)+' '+str(x2)+' '+str(y1)+' '+str(y2)+'\n')
            tfile.close()
        print('Saved')
    
    lab_dir=lab+'train/'
    os.mkdir(lab_dir)
    label_txt(train, lab_dir)
    
    lab_dir=lab+'test/'
    os.mkdir(lab_dir)
    label_txt(test, lab_dir)
    
    #let's check if txt files are correct:
    f2 = open("LFW/Labels/test/Arnold_Schwarzenegger.txt","r")
    print(f2.read())
    f2.close()

    # checking Arnold_Schwarzenegger_0041.jpg
    pic=cv2.imread(test+'Arnold_Schwarzenegger/Arnold_Schwarzenegger_0041.jpg')
    cv2.rectangle(pic,(77 ,62),(176,194),(255,255,0),2)
    plt.imshow(pic)
    plt.show()

    labels='LFW/Labels/train/'
    save_tf(train, labels)

    labels='LFW/Labels/test/'
    save_tf(test, labels)

    os.stat('train.tfrecord').st_size/1024/1024
    
    make_tarfile('test_images.tar.gz','LFW/test') 
    shutil.rmtree('LFW/')

    os.listdir('.')

if __name__ == "__main__":
    main()
