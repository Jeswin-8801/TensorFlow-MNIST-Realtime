import * as tf from "@tensorflow/tfjs";

export default class NumberRecognition {
    model: any;
    imageTensor: tf.Tensor3D;
    prediction: Float32Array = new Float32Array();

    constructor(canvas: HTMLCanvasElement) {
        this.imageTensor = this.preProcess(canvas);
    }

    preProcess(canvas: HTMLCanvasElement) {
        let image = tf.browser.fromPixels(canvas, 4);
        image = image.slice([0, 0, 3]);

        let imageTensor = tf.image.resizeNearestNeighbor(image, [28, 28]);
        imageTensor = imageTensor.reshape([1, 28, 28, 1]);
        imageTensor = tf.cast(imageTensor, "float32").div(255);

        return imageTensor;
    }

    async loadModel() {
        this.model = await tf.loadLayersModel(`model/model.json`);
    }

    async predict() {
        if (!this.model) return;

        await tf.tidy(() => {
            const output = this.model.predict(this.imageTensor);
            this.prediction = output.dataSync();
        });

        return this.model.predict(this.imageTensor).dataSync();
    }
}

// https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
