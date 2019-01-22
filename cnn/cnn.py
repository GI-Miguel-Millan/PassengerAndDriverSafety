import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from data import getData

tf.logging.set_verbosity(tf.logging.INFO)

def cnn_model(features, labels, mode): 
    #input layer
    input_layer = tf.reshape(features["x"], [-1, 300, 400, 1])

    #convolutional layer
    conv1 = tf.layers.conv2d(inputs=input_layer, filters=32, kernel_size=[5, 5], padding='same', activation=tf.nn.relu)

    #pooling layer
    pool1 = tf.layers.average_pooling2d(inputs=conv1, pool_size=[5, 5], strides=2)

    #dense layer
    dense = tf.layers.dense(inputs=pool1 units=1024, activation=tf.nn.relu)
    dropout = tf.layers.dropout(inputs=dense, rate=0.4, training=mode == tf.estimator.ModeKeys.TRAIN)

    #output
    logits = tf.layers.dense(inputs=dropout, units=4)
    predictions = {
        "classes": tf.argmax(input=logits, axis=1), 
        "probabilities": tf.nn.softmax(logits, name='softmax_tensor')
    }
 
    if mode == tf.estimator.ModeKeys.PREDICT:
        return tf.estimator.EstimatorSpec(mode=mode, predictions=predictions)

    #calculate Loss
    loss = tf.losses.sparse_softmax_cross_entropy(labels=labels, logits=logits)

    #Training op for TRAIN mode
    if mode == tf.estimator.ModeKeys.TRAIN:
        optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.001)
        train_op = optimizer.minimize(
            loss=loss,
            global_step=tf.train.get_global_step())
        return tf.estimator.EstimatorSpec(mode=mode, loss=loss, train_op=train_op)

    #Evaluation metrics for EVAL mode
    eval_metric_ops = {
        "accuracy": tf.metrics.accuracy(labels=labels, predictions=predictions["classes"])}
    return tf.estimator.EstimatorSpec(mode=mode, loss=loss, eval_metric_ops=eval_metric_ops)

def main(unused_argv):
    #Here is where we set our parameters and run the code on the image

if __name__ == "__main__":
    tf.app.run()