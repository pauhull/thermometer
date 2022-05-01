import "@fontsource/roboto/latin-300.css";
import "./App.scss";

import { render } from "preact";
import { useState } from "preact/hooks";
import SimplexNoise from "simplex-noise";

import strings from "../../strings.json";
import AlarmIndicator from "./components/AlarmIndicator";
import AlarmTempChooser from "./components/AlarmTempChooser";
import PhoneNumbers from "./components/PhoneNumbers";
import TempChart, { Record, TempData } from "./components/TempChart";

declare global {
    const DEVELOPMENT: boolean;
}

async function getTempRecords(): Promise<TempData> {

    const temp: Record = [];
    const hum: Record = [];
    const now = Date.now();

    if (DEVELOPMENT) {
        const simplex = new SimplexNoise("yeet");
        const n = 512;
        for (let i = 0; i < n; i++) {
            const time = new Date(now - (n - i) * 2000);
            temp.push([time, Math.round((25 + 5 * simplex.noise2D(time.getTime() / 500000, -420)) * 10) / 10]);
            hum.push([time, Math.round((50 + 20 * simplex.noise2D(time.getTime() / 300000, 420)) * 10) / 10]);
        }

    } else {
        const response = await (await fetch("/temps/history")).text();
        const temps = response.split(";")[0].split(",").map((v) => Number.parseFloat(v)).filter((n) => !isNaN(n));
        const hums = response.split(";")[1].split(",").map((v) => Number.parseFloat(v)).filter((n) => !isNaN(n));
        const n = Math.min(temps.length, hums.length);
        for (let i = 0; i < n; i++) {
            const time = new Date(now - (n - i) * 2000);
            temp.push([time, temps[i]]);
            hum.push([time, hums[i]]);
        }
    }

    return { temp, hum };
}

async function getPhoneNumbers(): Promise<string[]> {

    if (DEVELOPMENT) {
        return [];
    }

    const text = await (await fetch("/numbers/list")).text();
    return text.split("\n").filter((number) => number.length > 0);
}

async function getAlarmTemp(): Promise<number> {

    if (DEVELOPMENT) {
        return 35;
    }

    const text = await (await fetch("/alarm/get")).text();
    return Number.parseInt(text);
}

function App() {

    const [tempData, setTempData] = useState<TempData | null>();
    const [numbers, setNumbers] = useState<string[] | null>();
    const [alarmTemp, setAlarmTemp] = useState<number | null>();

    if (!tempData) {
        void getTempRecords().then((data) => setTempData(data));
        return <></>;
    }

    if (!numbers) {
        void getPhoneNumbers().then((data) => setNumbers(data));
        return <></>;
    }

    if (!alarmTemp) {
        void getAlarmTemp().then((data) => setAlarmTemp(data));
        return <></>;
    }

    return (
        <div className="main-container">
            <h1>{ strings.title }</h1>
            <AlarmIndicator />
            <TempChart data={tempData}/>
            <hr/>
            <AlarmTempChooser _alarmTemp={alarmTemp} />
            <PhoneNumbers _numbers={numbers}/>
        </div>
    );
}

render(
    <App />,
    document.body as Element
);