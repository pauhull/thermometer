import "./PhoneNumbers.scss";

import * as phone from "google-libphonenumber";
import { PhoneNumberFormat } from "google-libphonenumber";
import { createElement } from "preact";
import { useState } from "preact/hooks";
import { IconContext } from "react-icons";
import { AiOutlineCloseCircle, AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";

import strings from "../../../strings.json";
import JSX = createElement.JSX;

function PhoneNumbers({ _numbers }: { _numbers: string[] }) {

    const [numbers, setNumbers] = useState<string[]>(_numbers);
    const [numberError, setNumberError] = useState(false);
    const [number, setNumber] = useState("");
    const [addNumber, setAddNumber] = useState(false);

    const phoneUtil = new phone.PhoneNumberUtil();

    const buttonClick = () => {
        if (!addNumber) {
            setAddNumber(true);
        } else {
            let phoneNumber;
            try {
                phoneNumber = phoneUtil.parse(number, "DE");
            } catch (e) {}
            if (!phoneNumber || !phoneUtil.isValidNumber(phoneNumber)) {
                setNumberError(true);
            } else {
                const formatted = phoneUtil.format(phoneNumber, PhoneNumberFormat.E164);
                numbers.push(formatted);
                setNumbers(numbers);
                setNumber("");
                setAddNumber(false);
                DEVELOPMENT || void fetch(`/numbers/add?number=${encodeURIComponent(formatted)}`);
            }
        }
    };

    return (
        <IconContext.Provider value={{ color: "#fff" }}>
            <div className="number-list">
                { strings.alertNumbers }
                <ul>
                    {
                        numbers.map((_number, index) =>
                            <li key={_number}>
                                <span>{_number}</span>
                                <button onClick={() => {
                                    setNumbers(numbers.filter((_, i) => i !== index));
                                    DEVELOPMENT || void fetch(`/numbers/remove?index=${index}`);
                                }}>
                                    <AiOutlineDelete />
                                </button>
                            </li>
                        )
                    }
                    {
                        addNumber
                            && <li className="new-number">
                                <input type="tel" className={numberError ? "error" : ""} value={number} onInput={(e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
                                    numberError && setNumberError(false);
                                    setNumber(e.currentTarget.value);
                                }} onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        buttonClick();
                                    }
                                }}/>
                                <button onClick={() => {
                                    setNumber(""); setAddNumber(false);
                                }}>
                                    <AiOutlineCloseCircle />
                                </button>
                            </li>

                    }
                    <li>
                        <button onClick={buttonClick}>
                            <AiOutlinePlusCircle />{ strings.addNumber }
                        </button>
                    </li>
                </ul>
            </div>
        </IconContext.Provider>
    );
}

export default PhoneNumbers;