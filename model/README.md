# Model Construction and Training

For more information on model architecture and training refer [model/notebook.ipynb](model/notebook.ipynb)

Use the `train.py` script in `code/` to define, construct and save the model.

# Usage

> Ensure you have the required Python version specified in `Pipfile` before proceeding. If not, install a standalone version using `pyenv`

Setup the virtual environment using `pipenv` and run the script using the following commands

`cd` into `model/` and run:

```bash
pipenv shell
```

```bash
pipenv install
```

```bash
python code/train.py
```

*It takes a couple of minutes to get the model trained.*

> [!NOTE]
> After training, the model will be saved as `mnist.hs` in `data/`

> [!IMPORTANT]
> `mnist.h5` cannot be directly used by Tensorflowjs in React. It must be converted using `tensorflow_converter` to a compatible format <br/>

> Find more about converting at
> - https://www.tensorflow.org/js/tutorials/conversion/import_keras
> - https://www.npmjs.com/package/@tensorflow/tfjs-converter
>   - [Related issues that you may come across when converting](https://github.com/tensorflow/tfjs/issues/8321)

## Useful Links

- https://medium.com/ailab-telu/learn-and-play-with-tensorflow-js-part-3-dd31fcab4c4b
- https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
