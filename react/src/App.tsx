import { useState } from "react";
import Canvas from "./components/Canvas";
import Graph from "./components/Graph";

function App() {
    const [clear, setClear] = useState(false);

    const [imageUri, setImageUri] = useState("");

    const [prediction, setPrediction] = useState(new Float32Array());

    return (
        <>
            <div className="flex flex-col sm:flex-row space-x-5 bg-gradient-to-bl from-slate-50 to-rose-100 items-center justify-center">
                <section className="overflow-hidden sm:w-1/3 w-full">
                    <div className="w-full mx-auto max-w-xl flex flex-col min-h-svh py-10 items-center justify-center">
                        <div className="flex lg:w-3/4 prose text-gray-600 prose-sm prose-headings:font-normal prose-headings:text-xl">
                            <p className="font-light text-xl">
                                Start Drawing!!
                            </p>
                        </div>
                        <div className="mt-6 border-stone-300 border-t pt-12 lg:w-3/4 w-3/4">
                            <div>
                                <Canvas
                                    clear={clear}
                                    setClear={setClear}
                                    sendSetClearToParent={setImageUri}
                                    setPrediction={setPrediction}
                                />
                                <div className="flex mt-8">
                                    <button
                                        onClick={() => setClear(true)}
                                        className="relative flex text-lg group"
                                    >
                                        <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                                            <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-stone-200"></span>
                                            <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                                            <span className="relative">
                                                Clear
                                            </span>
                                        </span>
                                        <span
                                            className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                                            data-rounded="rounded-lg"
                                        ></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div
                    className={`filter invert p-10 pr-12 h-full my-5 items-center justify-center ${
                        imageUri ? "flex-col" : "hidden"
                    }`}
                >
                    <div className="flex text-gray-400 p-5">
                        <p className="font-light text-xl">Processed Image</p>
                    </div>
                    <div className="flex ml-10 items-center justify-center bg-white w-24 h-28 rounded-md shadow-lg shadow-violet-200">
                        <img src={imageUri} width={240} height={280} />
                    </div>
                </div>

                <div className="flex h-screen sm:w-1/3 w-full py-20 pl-8">
                    <Graph results={prediction} />
                </div>
            </div>
        </>
    );
}

export default App;
