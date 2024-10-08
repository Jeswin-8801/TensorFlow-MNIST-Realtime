import { useCallback, useEffect, useRef, useState } from "react";
import { trim } from "../util/Util";
import NumberRecognition from "../util/NumberRecognition";

interface Props {
    clear: boolean;
    setClear: (param: boolean) => void;
    sendSetClearToParent: (data: string) => void;
    setPrediction: (data: Float32Array) => void;
}

type Coordinate = {
    x: number;
    y: number;
};

const Canvas = ({
    clear,
    setClear,
    sendSetClearToParent,
    setPrediction,
}: Props) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const pixelRatio = window.devicePixelRatio;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scaledCanvasRef = useRef<HTMLCanvasElement>(null);
    const [modifying, setModifying] = useState(false);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(
        undefined
    );

    const getWidth = () => {
        return Math.floor(pixelRatio * canvasRef.current!.clientWidth);
    };

    const getHeight = () => {
        return Math.floor(
            pixelRatio * canvasRef.current!.clientHeight > 400
                ? canvasRef.current!.clientHeight
                : canvasRef.current!.clientWidth
        );
    };

    // responsive width and height
    useEffect(() => {
        let h = getHeight();
        let w = getWidth();
        setWidth(w < h ? w : h);
        setHeight(h < w ? h : w);
    }, []);

    useEffect(() => {
        if (clear) {
            canvasRef.current!.getContext("2d")!.reset();
            setModifying(false);
        }
    }, [clear]);

    const startPaint = useCallback((event: TouchEvent | MouseEvent) => {
        const coordinates = getCoordinates(event);
        if (coordinates) {
            setMousePosition(coordinates);
            setIsPainting(true);
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener("mousedown", startPaint);
        canvas.addEventListener("touchstart", startPaint);
        return () => {
            canvas.removeEventListener("mousedown", startPaint);
            canvas.removeEventListener("touchstart", startPaint);
        };
    }, [startPaint]);

    const paint = useCallback(
        (event: TouchEvent | MouseEvent) => {
            if (isPainting) {
                const newMousePosition = getCoordinates(event);
                if (mousePosition && newMousePosition) {
                    drawLine(mousePosition, newMousePosition);
                    setMousePosition(newMousePosition);
                }
            }
        },
        [isPainting, mousePosition]
    );

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener("mousemove", paint);
        canvas.addEventListener("touchmove", paint);
        return () => {
            canvas.removeEventListener("mousemove", paint);
            canvas.removeEventListener("touchmove", paint);
        };
    }, [paint]);

    const exitPaint = useCallback(() => {
        setIsPainting(false);
        setModifying(false);
        setMousePosition(undefined);
    }, []);

    const printDigit = useCallback(() => {
        if (modifying) {
            if (!canvasRef.current) return;
            let canvas: HTMLCanvasElement = canvasRef.current;
            canvas = trim(canvas);

            if (!scaledCanvasRef.current) return;
            const scaledCanvas: HTMLCanvasElement = scaledCanvasRef.current;
            const contextScaled = scaledCanvas.getContext("2d", {
                willReadFrequently: true,
            });
            if (!contextScaled) return;
            contextScaled.save();
            contextScaled.clearRect(
                0,
                0,
                contextScaled.canvas.height,
                contextScaled.canvas.width
            );
            contextScaled.scale(28.0 / canvas.width, 28.0 / canvas.height);
            contextScaled.drawImage(canvas, 0, 0);
            sendSetClearToParent(scaledCanvas.toDataURL());

            const numberRecognition = new NumberRecognition(canvas);
            numberRecognition.loadModel().then(() => {
                numberRecognition
                    .predict()
                    .then((value) => {
                        setPrediction(value);
                    })
                    .catch((error) => {
                        console.error("Promise rejected with error: " + error);
                    });
            });

            contextScaled.restore();
        }
    }, [modifying, width, height]);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener("mouseup", printDigit);
        canvas.addEventListener("mouseleave", printDigit);
        canvas.addEventListener("touchend", printDigit);
        canvas.addEventListener("touchcancel", printDigit);

        canvas.addEventListener("mouseup", exitPaint);
        canvas.addEventListener("mouseleave", exitPaint);
        canvas.addEventListener("touchend", exitPaint);
        canvas.addEventListener("touchcancel", exitPaint);
        return () => {
            canvas.removeEventListener("mouseup", printDigit);
            canvas.removeEventListener("mouseleave", printDigit);
            canvas.removeEventListener("touchend", printDigit);
            canvas.removeEventListener("touchcancel", printDigit);

            canvas.removeEventListener("mouseup", exitPaint);
            canvas.removeEventListener("mouseleave", exitPaint);
            canvas.removeEventListener("touchend", exitPaint);
            canvas.removeEventListener("touchcancel", exitPaint);
        };
    }, [exitPaint, printDigit]);

    const getCoordinates = (
        event: TouchEvent | MouseEvent
    ): Coordinate | undefined => {
        if (!canvasRef.current) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;

        if (event.type === "touchstart" || event.type === "touchmove") {
            event = event as TouchEvent;
            return {
                x: event.touches[0].pageX - canvas.offsetLeft,
                y: event.touches[0].pageY - canvas.offsetTop,
            };
        } else if (event.type === "mousedown" || event.type === "mousemove") {
            event = event as MouseEvent;
            return {
                x: event.pageX - canvas.offsetLeft,
                y: event.pageY - canvas.offsetTop,
            };
        }
    };

    const drawLine = (
        originalMousePosition: Coordinate,
        newMousePosition: Coordinate
    ) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (context) {
            if (clear) setClear(false);

            context.lineJoin = "round";
            context.lineWidth = 8;

            context.beginPath();
            context.moveTo(originalMousePosition.x, originalMousePosition.y);
            context.lineTo(newMousePosition.x, newMousePosition.y);
            context.closePath();

            context.stroke();
            setModifying(true);
        }
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                height={height}
                width={width}
                className="border border-gray-200 shadow-xl shadow-stone-300 rounded-xl w-full touch-none"
            />
            <canvas
                ref={scaledCanvasRef}
                width={28}
                height={28}
                className="hidden"
            />
        </>
    );
};

export default Canvas;
