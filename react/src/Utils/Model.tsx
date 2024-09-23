import * as tf from "@tensorflow/tfjs";

export const getBinaryArrayFromImage = (canvas: HTMLCanvasElement) => {
    const tensor_pixels = tf
        .scalar(1)
        .sub(tf.browser.fromPixels(canvas, 1).toFloat().div(255));
    const pixels = tf.reshape(tensor_pixels, [1, 28, 28, 1]);
    return pixels;
};
