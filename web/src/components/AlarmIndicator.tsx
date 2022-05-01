import "./AlarmIndicator.scss";

import { useEffect, useState } from "preact/hooks";
import { AiOutlineWarning } from "react-icons/ai";

import strings from "../../../strings.json";

function AlarmIndicator() {

    const [alarm, setAlarm] = useState(false);
    const [temp, setTemp] = useState(0);
    const [time, setTime] = useState("");

    useEffect(() => {
        const update = () => {
            DEVELOPMENT || fetch("/alarm/status")
                .then(async (response) => response.text())
                .then((response) => {
                    const lines = response.split("\n");
                    if (lines[0] === "true") {
                        setAlarm(true);
                        setTemp(Number.parseFloat(lines[1]));
                        setTime(lines[2].substring(0, 5));
                    }
                });
        };

        const interval = setInterval(update, 1000);
        void update();
        return () => clearInterval(interval);
    });

    return alarm
        ? <div className="alarm-indicator">
            <AiOutlineWarning size={30}/>
            { strings.alert
                .replace("{temp}", temp.toString().replace(".", ","))
                .replace("{time}", time)
            }
        </div>
        : <></>;
}

export default AlarmIndicator;