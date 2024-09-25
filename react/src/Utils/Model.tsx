import * as tf from "@tensorflow/tfjs";

export const getBinaryArrayFromImage = (canvas: HTMLCanvasElement) => {
    const digit = preProcess(canvas);

    let model = undefined;
    (async () => {
        model = await tf.loadLayersModel("/model/model.json");
        var prediction = model.predict(digit).mul(100).dataSync();
        console.log(prediction);
    })();
};

function preProcess(canvas: HTMLCanvasElement) {
    let img = tf.browser.fromPixels(canvas, 4);
    img = img.slice([0, 0, 3]);
    img = tf.image.resizeNearestNeighbor(img, [28, 28]);
    img = img.reshape([1, 28, 28, 1]);
    img = tf.cast(img, "float32").div(255);

    return img;
}

// https://storage.googleapis.com/tfjs-vis/mnist/dist/index.html
