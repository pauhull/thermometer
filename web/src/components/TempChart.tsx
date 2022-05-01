import "./TempChart.scss";

import { format, graphic } from "echarts";
import { useEffect, useState } from "preact/hooks";
import SimplexNoise from "simplex-noise";

import strings from "../../../strings.json";
import { EChartsOption, ReactECharts } from "./ReactECharts";

type Record = [Date, number][];
type TempData = { temp: Record, hum: Record };

const simplex = DEVELOPMENT ? new SimplexNoise("yeet") : null;

async function getNextRecord(): Promise<[Date, number, number]> {

    const now = new Date();
    let temp: number, hum: number;

    if (DEVELOPMENT && simplex) {
        temp = Math.round((25 + 5 * simplex.noise2D(now.getTime() / 500000, -420)) * 10) / 10;
        hum = Math.round((50 + 20 * simplex.noise2D(now.getTime() / 300000, 420)) * 10) / 10;
    } else {
        const response = await (await fetch("/temps/now")).text();
        temp = Number.parseFloat(response.split(";")[0]);
        hum = Number.parseFloat(response.split(";")[1]);
    }

    return [now, temp, hum];
}

function TempChart({ data }: { data: TempData }) {

    const [option, setOption] = useState<EChartsOption | null>();

    useEffect(() => {
        const listener = () => {
            setOption({
                xAxis: {
                    splitNumber: Math.min(window.screen.width / 200, 5)
                }
            });
        };
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    });

    useEffect(() => {
        const timer = setInterval(() => {
            void (async () => {
                const nextRecord = await getNextRecord();
                data.temp.push([nextRecord[0], nextRecord[1]]);
                data.hum.push([nextRecord[0], nextRecord[2]]);

                data.temp = data.temp.filter((record) => Date.now() - record[0].getTime() <= 1024000);
                data.hum = data.hum.filter((record) => Date.now() - record[0].getTime() <= 1024000);

                setOption({
                    series: [
                        {
                            data: data.temp
                        },
                        {
                            data: data.hum
                        }
                    ]
                });
            })();
        }, 2000);

        return () => clearInterval(timer);
    }, [data]);

    return (
        <div className="temp-chart">
            <ReactECharts option={option ?? {
                darkMode: false,
                grid: {
                    containLabel: true,
                    top: 32,
                    right: 12,
                    bottom: 12,
                    left: 12,
                    show: false
                },
                textStyle: {
                    fontFamily: "Roboto"
                },
                xAxis: {
                    type: "time",
                    splitNumber: Math.min(window.screen.width / 200, 5),
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#222"
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#eee"
                        }
                    }
                },
                yAxis: [
                    {
                        name: strings.temperature,
                        type: "value",
                        axisLabel: {
                            formatter: "{value}°C"
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#222"
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#eee"
                            }
                        },
                        boundaryGap: ["10%", "10%"]
                    },
                    {
                        name: strings.humidity,
                        type: "value",
                        alignTicks: true,
                        axisLabel: {
                            formatter: "{value}%"
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#eee"
                            }
                        },
                        boundaryGap: ["10%", "10%"]
                    }
                ],
                series: [
                    {
                        yAxisIndex: 0,
                        name: strings.temperature,
                        data: data.temp,
                        type: "line",
                        smooth: true,
                        showSymbol: false,
                        color: "#ff4242",
                        areaStyle: {
                            color: new graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: "#ff333380"
                                },
                                {
                                    offset: 0.4,
                                    color: "#ff333300"
                                }
                            ])
                        }
                    },
                    {
                        yAxisIndex: 1,
                        name: strings.humidity,
                        data: data.hum,
                        type: "line",
                        smooth: true,
                        showSymbol: false,
                        color: "#4284ed",
                        areaStyle: {
                            color: new graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: "#1d6ef080"
                                },
                                {
                                    offset: 0.6,
                                    color: "#1d6ef000"
                                }
                            ])
                        }
                    }
                ],
                tooltip: {
                    trigger: "axis",
                    backgroundColor: "#0c0c0c",
                    borderColor: "#444",
                    textStyle: {
                        color: "#ddd"
                    },
                    formatter: (params: { marker: string, seriesName: string, value: string[] }[]) =>
                        "<strong>" + format.formatTime("hh:mm", params[0].value[0]) + "</strong>"
                        + "<li style=\"list-style:none\">" + params[0].marker + params[0].seriesName
                        + "&nbsp&nbsp&nbsp<span style=\"float: right\">"
                        + params[0].value[1].toString().replace(".", ",") + "°C</span></li>"
                        + "<li style=\"list-style:none\">" + params[1].marker + params[1].seriesName
                        + "&nbsp&nbsp&nbsp<span style=\"float: right\">"
                        + params[1].value[1].toString().replace(".", ",") + "%</span></li>"
                }
            }}
            />
        </div>
    );
}

export type { Record, TempData };
export default TempChart;