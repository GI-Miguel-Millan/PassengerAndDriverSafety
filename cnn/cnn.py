from keras.layers import Dense, Flatten, Dropout, ZeroPadding3D
from keras.layers.recurrent import LSTM
from keras.models import Sequential, load_model
from keras.optimizers import Adam, RMSprop
from keras.layers.wrappers import TimeDistributed
from keras.layers.convolutional import (Conv2D, MaxPooling3D, Conv3D,
    MaxPooling2D)
from collections import deque
import sys

class CNNModel():
    def __init__(self, nb_classes, model, seq_length,
                 saved_model=None, features_length=2048):
        # Set defaults.
        self.seq_length = seq_length
        self.load_model = load_model
        self.saved_model = saved_model
        self.nb_classes = nb_classes
        self.feature_queue = deque()

        # Set the metrics. Only use top k if there's a need.
        metrics = ['accuracy']
        if self.nb_classes >= 10:
            metrics.append('top_k__categor_ical_accuracy')

        # Either use model that has already been made to build on it, or use new one
        if self.saved_model is not None:
            print("Loading model %s" % self.saved_model)
            self.model = load_model(self.saved_model
        else:
            self.model = load_model(self.saved_model)
            self.input_shape = (seq_length, 80, 80, 3)
            self.model = self.lrcn()

        # Now compile the network.
        optimizer = Adam(lr=1e-5, decay=1e-6)
        self.model.compile(loss='categorical_crossentropy', optimizer=optimizer,
                           metrics=metrics)

    def lrcn(self):
        # Based on model from https://github.com/harvitronix/five-video-classification-methods/blob/master/models.py    """
        # Specifies 
        model = Sequential()

        # Build a convolutional neural network. Time-distributed over 2D frames.
        # Two convolutional layers followed by pooling layer.
        # Keras convolutional layers guide guide: https://keras.io/layers/convolutional/
        model.add(TimeDistributed(Conv2D(32, (7, 7), strides=(2, 2),
            activation='relu', padding='same'), input_shape=self.input_shape))
        model.add(TimeDistributed(Conv2D(32, (3,3),
            kernel_initializer="he_normal", activation='relu')))
        model.add(TimeDistributed(MaxPooling2D((2, 2), strides=(2, 2))))

        model.add(TimeDistributed(Conv2D(64, (3,3),
            padding='same', activation='relu')))
        model.add(TimeDistributed(Conv2D(64, (3,3),
            padding='same', activation='relu')))
        model.add(TimeDistributed(MaxPooling2D((2, 2), strides=(2, 2))))

        model.add(TimeDistributed(Conv2D(128, (3,3),
            padding='same', activation='relu')))
        model.add(TimeDistributed(Conv2D(128, (3,3),
            padding='same', activation='relu')))
        model.add(TimeDistributed(MaxPooling2D((2, 2), strides=(2, 2))))

        model.add(TimeDistributed(Conv2D(256, (3,3),
            padding='same', activation='relu')))
        model.add(TimeDistributed(Conv2D(256, (3,3),
            padding='same', activation='relu')))
        model.add(TimeDistributed(MaxPooling2D((2, 2), strides=(2, 2))))
        
        model.add(TimeDistributed(Conv2D(512, (3,3),
            padding='same', activation='relu')))
        model.add(TimeDistributed(Conv2D(512, (3,3),
            padding='same', activation='relu')))
        model.add(TimeDistributed(MaxPooling2D((2, 2), strides=(2, 2))))

        model.add(TimeDistributed(Flatten()))

        model.add(Dropout(0.5))
        # Feed into a LSTM, which is a recurrent neural network layer
        model.add(LSTM(256, return_sequences=False, dropout=0.5))
        model.add(Dense(self.nb_classes, activation='softmax'))

        return model
