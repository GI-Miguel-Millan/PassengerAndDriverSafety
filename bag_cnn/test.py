from __future__ import absolute_import, division, print_function

import os

import tensorflow as tf
from tensorflow import keras
import argparse
import json
from data import DataSet

tf.__version__

# construct argument parser
ap = argparse.ArgumentParser()
ap.add_argument("--model", required=True, help="path to model (.hdf5) file")
ap.add_argument("--conf", required=True, help="configuration file containing parameters to run the model")
args = vars(ap.parse_args())

# Load config and assign Constants
conf = json.load(open(args["conf"]))
seq_length=conf["seq_length"]
class_limit=conf["class_limit"]
image_shape=tuple(conf["image_shape"])
batch_size=conf["batch_size"]

if conf["using_images"]:
    data_type="images"
else:
    data_type=None

# Load the model
model = args["model"]
print("Loading model: " + model)

new_model = keras.models.load_model(model)
new_model.summary()

# Get test data generator:
data = DataSet(
    seq_length=seq_length,
    class_limit=class_limit,
    image_shape=image_shape
)

val_generator = data.frame_generator(batch_size=batch_size, train_test='test', data_type=data_type)

acc = new_model.evaluate_generator(val_generator, 7, verbose=1)

print(acc)
