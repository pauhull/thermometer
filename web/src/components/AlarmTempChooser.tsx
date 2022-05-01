import "./AlarmTempChooser.scss";

import { createElement } from "preact";
import { useState } from "preact/hooks";
import JSX = createElement.JSX;
import { IconContext } from "react-icons";
import { AiOutlineCheckCircle } from "react-icons/ai";

import strings from "../../../strings.json";

function AlarmTempChooser({ _alarmTemp }: { _alarmTemp: number }) {

    const [showButton, setShowButton] = useState(false);
    const [alarmTemp, setAlarmTemp] = useState(_alarmTemp.toString());
    const [alarmTempError, setAlarmTempError] = useState(false);

    const submit = () => {
        if (alarmTempError) return;
        setShowButton(false);
        void fetch("/alarm/set?temp=" + alarmTemp);
    };

    return (
        <div className={"chooser"}>
            { strings.maxTemperature }
            <input type="number" className={alarmTempError ? "error" : ""} onKeyPress={(e) => {
                if (e.key === "Enter") {
                    submit();
                } else if (isNaN(Number.parseInt(e.key))) {
                    e.preventDefault();
                    return false;
                }
            }} onInput={(e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                setShowButton(true);
                setAlarmTemp(e.currentTarget.value.substring(0, 3));
                const temp = Number.parseInt(e.currentTarget.value);
                if (isNaN(temp) || !Number.isInteger(temp) || temp < 0 || temp > 100) {
                    setAlarmTempError(true);
                    return;
                }
                setAlarmTempError(false);
            }} value={alarmTemp} min={0} max={100}
            />°C
            {
                showButton && <button onClick={submit} disabled={alarmTempError}>
                    <IconContext.Provider value={{ color: "#fff" }}>
                        <AiOutlineCheckCircle />
                    </IconContext.Provider>
                </button>
            }
        </div>
    );
}

export default AlarmTempChooser;