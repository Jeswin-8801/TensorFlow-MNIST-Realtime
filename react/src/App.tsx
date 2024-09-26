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
                    <div className="w-full mx-auto max-w-xl flex flex-col sm:min-h-svh sm:py-10 py-32 items-center justify-center">
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

                {prediction.length > 0 ? (
                    <>
                        <div className="sm:hidden bg-slate-950 text-teal-100 font-bold p-4 rounded-full">
                            scroll down to see the results
                        </div>
                        <div className="flex-colfilter invert p-10 pr-12 h-full my-5 items-center justify-center">
                            <div className="flex text-gray-400 p-5">
                                <p className="font-light text-xl">
                                    Processed Image
                                </p>
                            </div>
                            <div className="flex ml-10 items-center justify-center bg-white w-24 h-28 rounded-md shadow-lg shadow-violet-200">
                                <img src={imageUri} width={240} height={280} />
                            </div>
                        </div>

                        <div className="flex h-screen sm:w-1/3 w-full py-20 pl-8">
                            <Graph results={prediction} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex h-full py-40 items-center justify-center">
                            <div role="status">
                                <svg
                                    aria-hidden="true"
                                    className="inline size-20 text-gray-200 animate-spin dark:text-stone-200 fill-teal-300"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default App;
