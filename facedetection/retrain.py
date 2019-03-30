


import tensorflow as tf
import os
import matplotlib
import matplotlib.pyplot as plt
import re

tf.__version__
print(os.listdir("."))

'''
# changing the directory for installation of below modules
# tensorflow models section has an object detection library
# piping logs to text files, otherwise the notebook is not very readable
!git clone --quiet https://github.com/tensorflow/models.git > models.txt
# protobuf is needed for creating py files from models library above
!apt-get install -qq protobuf-compiler > proto.txt

# pycoco for coco scores
On Linux mint 19:
    - git clone https://github.com/cocodataset/cocoapi.git 
    - cd cocoapi/PythonAPI
    - vim Makefile ==> change 'python' to 'python3'
    - pip3 install cython
    - sudo apt-get install python3-dev
    - sudo python3 setup.py install
To get it in the venv:
    - cp /usr/local/lib/python3.6/dist-packages/pycocotools-2.0-py3.6-linux-x86_64.egg/pycocotools/_mask.cpython-36m-x86_64-linux-gnu.so /home/miguel/PassengerAndDriverSafety/facedetection/fd-venv/lib/python3.6/site-packages/
    - source fd-venv/bin/activate 
    - pip3 install pycocotools
DOESN'T WORK: !pip install -q pycocotools > pycoco.txt

# creating py files from protos
%cd /kaggle/working/models/research
!protoc object_detection/protos/*.proto --python_out=.
# setting path, if not set, python can not use object detection library (from models)
import os
os.environ['PYTHONPATH'] += ':/kaggle/working/models/research/:/kaggle/working/models/research/slim/'
# if prints OK, then installation and environment are set up correctly
!python object_detection/builders/model_builder_test.py
'''
# May have to set the python env variable manually first...
# os.environ['PYTHONPATH'] += ':$HOME/PassengerAndDriverSafety/facedetection/models/research/:$Home/PassengerAndDriverSafety/facedetection/models/research/slim/'

# Follow these instructions to set the python path if using a virtual environment:
# https://stackoverflow.com/questions/4757178/how-do-you-set-your-pythonpath-in-an-already-created-virtualenv

# now run this in the in <path>/models/research:
# python3 object_detection/builders/model_builder_test.py

# copy your pipeline.config from the ssd_mobilenet_v1_coco_2018_1_28 folder to your working directory.

pipeline_fname="pipeline.config"
fine_tune_checkpoint="ssd_mobilenet_v1_coco_2018_01_28/model.ckpt"
train_record_fname="input/face-recognition-part-1/train.tfrecord"
test_record_fname="input/face-recognition-part-1/test.tfrecord"
label_map_pbtxt_fname="input/face-recognition-part-1/object_label.pbtxt"
batch_size=64
num_steps=20000
num_classes=62
num_examples=5000

with open(pipeline_fname) as f:
    s = f.read()
with open(pipeline_fname, 'w') as f:

    # fine_tune_checkpoint
    s = re.sub('fine_tune_checkpoint: ".*?"',
               'fine_tune_checkpoint: "{}"'.format(fine_tune_checkpoint), s)

    # tfrecord files both train and test.
    s = re.sub(
        '(input_path: ".*?)(train.record)(.*?")', 'input_path: "{}"'.format(train_record_fname), s)
    s = re.sub(
        '(input_path: ".*?)(eval.record)(.*?")', 'input_path: "{}"'.format(test_record_fname), s)
    # label_map_path
    s = re.sub(
        'label_map_path: ".*?"', 'label_map_path: "{}"'.format(label_map_pbtxt_fname), s)
    # Set training batch_size.
    s = re.sub('batch_size: [0-9]+',
               'batch_size: {}'.format(batch_size), s)
    # Set training steps, num_steps
    s = re.sub('num_steps: [0-9]+',
               'num_steps: {}'.format(num_steps), s)
    s = re.sub('num_examples: [0-9]+',
               'num_examples: {}'.format(num_examples), s)
    # Set number of classes num_classes.
    s = re.sub('num_classes: [0-9]+',
               'num_classes: {}'.format(num_classes), s)
    f.write(s)

train='training/'

os.system('python3 models/research/object_detection/model_main.py --pipeline_config_path='+pipeline_fname+' --model_dir=training/ --alsologtostderr > train.txt')
print("Finished training")

