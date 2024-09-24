import os.path
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from custom_util import *

# global
input_shape = (28, 28, 1)
batch_size = 64
num_classes = 10
epochs = 5
callbacks = myCallback()

def processData():
    (x_train, y_train), (x_test, y_test) = getData()
    print('Download and split dataset ✔️')
    if checkNaN(x_train, x_test):
        print('\nFound invalid values in the training dataset, EXITING.')
        return;
    print('No invalid values found in training dataset ✔️')
    x_train, x_test = normalizeAndReshape(x_train, x_test)
    print('Normalizing and Reshaping ✔️')
    y_train, y_test = labelEncode(y_train, y_test)
    print('Label Encode ✔️')
    return (x_train, y_train), (x_test, y_test)
    

def defineModel():
    model = tf.keras.models.Sequential([
        tf.keras.Input(shape = input_shape),
        tf.keras.layers.Conv2D(32, (5, 5), padding = 'same', activation = 'relu'),
        tf.keras.layers.Conv2D(32, (5, 5), padding = 'same', activation = 'relu'),
        tf.keras.layers.MaxPool2D(),
        tf.keras.layers.Dropout(0.25),
        tf.keras.layers.Conv2D(64, (3, 3), padding = 'same', activation = 'relu'),
        tf.keras.layers.Conv2D(64, (3, 3), padding = 'same', activation = 'relu'),
        tf.keras.layers.MaxPool2D(strides = (2, 2)),
        tf.keras.layers.Dropout(0.25),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation = 'relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(num_classes, activation = 'softmax')
    ])
    model.compile(optimizer = tf.keras.optimizers.RMSprop(epsilon = 1e-08), loss = 'categorical_crossentropy', metrics = ['acc'])
    print('Construct and Define Model ✔️')
    return model

def fitModel(x_train, y_train, model):
    model.fit(x_train, y_train,
                    batch_size = batch_size,
                    epochs = epochs,
                    validation_split = 0.1,
                    callbacks = [callbacks])
    print('Fit Model ✔️')
    model_store_path = os.path.join(os.path.abspath('./model'), 'data', 'mnist.keras')
    model.save(model_store_path)
    print('Saved Model to {} ✔️'.format(model_store_path))
    
    
def main():
    (x_train, y_train), (x_test, y_test) = processData()
    model = defineModel()
    fitModel(x_train, y_train, model)
    print('Evaluating...')
    model.evaluate(x_test, y_test)
    print('Training ✔️\n')
    

if __name__ == '__main__':
    main()
