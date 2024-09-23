import { useState } from "react";
import Canvas from "./components/Canvas";

function App() {
    const [clear, setClear] = useState(false);

    return (
        <>
            <section className="overflow-hidden">
                <div className="w-full mx-auto max-w-xl flex flex-col min-h-svh justify-center py-10 p-8">
                    <div className="w-3/4 prose text-gray-500 prose-sm prose-headings:font-normal prose-headings:text-xl">
                        <p className="font-light text-xl">Start Drawing!!</p>
                    </div>
                    <div className="mt-6 border-t pt-12 w-3/4">
                        <div>
                            <Canvas clear={clear} setClear={setClear} />
                            <div className="flex mt-8">
                                <button
                                    onClick={() => setClear(true)}
                                    className="relative flex text-lg group"
                                >
                                    <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                                        <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                                        <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                                        <span className="relative">Clear</span>
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
        </>
    );
}

export default App;
