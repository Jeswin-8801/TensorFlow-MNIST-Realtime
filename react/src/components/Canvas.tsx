import { useCallback, useEffect, useRef, useState } from "react";
import { trim } from "../Utils/Util";
import { getBinaryArrayFromImage } from "../Utils/Model";

interface Props {
    clear: boolean;
    setClear: (param: boolean) => void;
    sendDataToParent: (data: string) => void;
}

type Coordinate = {
    x: number;
    y: number;
};

const Canvas = ({ clear, setClear, sendDataToParent }: Props) => {
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

    const startPaint = useCallback((event: MouseEvent) => {
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
        return () => {
            canvas.removeEventListener("mousedown", startPaint);
        };
    }, [startPaint]);

    const paint = useCallback(
        (event: MouseEvent) => {
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
        return () => {
            canvas.removeEventListener("mousemove", paint);
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
            sendDataToParent(scaledCanvas.toDataURL());

            getBinaryArrayFromImage(scaledCanvas);
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
        canvas.addEventListener("mouseup", exitPaint);
        canvas.addEventListener("mouseleave", exitPaint);
        return () => {
            canvas.removeEventListener("mouseup", printDigit);
            canvas.removeEventListener("mouseleave", printDigit);
            canvas.removeEventListener("mouseup", exitPaint);
            canvas.removeEventListener("mouseleave", exitPaint);
        };
    }, [exitPaint, printDigit]);

    const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
        if (!canvasRef.current) {
            return;
        }

        const canvas: HTMLCanvasElement = canvasRef.current;
        return {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop,
        };
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

            context.strokeStyle = "white";
            context.fillStyle = "black";
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
            <div className="border border-gray-200 shadow-xl rounded-xl ">
                <canvas
                    ref={canvasRef}
                    height={height}
                    width={width}
                    className=" bg-black rounded-xl w-full filter invert"
                />
            </div>
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
