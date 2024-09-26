import { ResponsiveBar } from "@nivo/bar";

interface Props {
    results: Float32Array;
}

const Graph = ({ results }: Props) => {
    return (
        <>
            <ResponsiveBar
                data={convertFloat32ArrayToObjects(results)}
                keys={["prediction"]}
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                layout="horizontal"
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "nivo" }}
                borderRadius={2}
                borderColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                }}
                theme={{
                    text: {
                        fontSize: 15,
                        fontFamily: "Consolas",
                    },
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    truncateTickAt: 0,
                }}
                colorBy="indexValue"
                labelSkipWidth={200}
                labelSkipHeight={12}
                labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                }}
                tooltip={(value) => {
                    return (
                        <div className="rounded-full bg-slate-950 shadow-lg font-mono font-extrabold text-teal-50 p-2">
                            {value.data.prediction}
                        </div>
                    );
                }}
                // label={(l) => `${l.data.prediction} %`}
                role="application"
                ariaLabel="Predictions Chart"
            />
        </>
    );
};

function convertFloat32ArrayToObjects(
    floatArray: Float32Array
): { id: number; prediction: number }[] {
    const resultArray: { id: number; prediction: number }[] = [];
    for (let i = 0; i < floatArray.length; i++)
        resultArray.push({ id: i, prediction: floatArray[i] });
    return resultArray;
}

export default Graph;
