export const trim = (canvas: HTMLCanvasElement) => {
    var context = canvas.getContext("2d"),
        copy = document.createElement("canvas").getContext("2d"),
        pixels = context!.getImageData(0, 0, canvas.width, canvas.height),
        l = pixels.data.length,
        i,
        bound = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        x,
        y;

    for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % canvas.width;
            y = ~~(i / 4 / canvas.width);

            if (bound.top === 0) {
                bound.top = y;
            }

            if (bound.left === 0) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }

            if (bound.right === 0) {
                bound.right = x;
            } else if (bound.right < x) {
                bound.right = x;
            }

            if (bound.bottom === 0) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    }

    var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left,
        trimmed = context!.getImageData(
            bound.left,
            bound.top,
            trimWidth,
            trimHeight
        );

    copy!.canvas.width =
        (trimWidth > trimHeight ? trimWidth : trimHeight) + trimWidth / 7;
    copy!.canvas.height =
        (trimHeight > trimWidth ? trimHeight : trimWidth) + trimHeight / 7;
    copy!.putImageData(
        trimmed,
        (copy!.canvas.width - trimWidth) / 2,
        (copy!.canvas.height - trimHeight) / 2
    );

    // open new window with trimmed image:
    return copy!.canvas;
};
