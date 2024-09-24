import logging, os
logging.disable(logging.WARNING)
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import tensorflow as tf
import numpy as np

def getData():
    (x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
    assert x_train.shape == (60000, 28, 28)
    assert x_test.shape == (10000, 28, 28)
    assert y_train.shape == (60000,)
    assert y_test.shape == (10000,)
    return (x_train, y_train), (x_test, y_test)


def checkNaN(x_train, x_test):
    return np.isnan(x_train).any() or np.isnan(x_test).any()


def normalizeAndReshape(x_train, x_test):
    x_train = x_train.reshape(x_train.shape[0], x_train.shape[1], x_train.shape[2], 1)
    x_train = x_train / 255.0
    x_test = x_test.reshape(x_test.shape[0], x_test.shape[1], x_test.shape[2], 1)
    x_test = x_test / 255.0
    return x_train, x_test


def labelEncode(y_train, y_test):
    y_train = tf.one_hot(y_train.astype(np.int32), depth=10)
    y_test = tf.one_hot(y_test.astype(np.int32), depth=10)
    return y_train, y_test


# callback to check accuracy during training
class myCallback(tf.keras.callbacks.Callback):
  def on_epoch_end(self, epoch, logs = {}):
    if(logs.get('acc') > 0.995):
      print("\nReached an accuracy of 99.5%, furthur training will not produce any significant gain in accuracy, hence stopping.")
      self.model.stop_training = True
