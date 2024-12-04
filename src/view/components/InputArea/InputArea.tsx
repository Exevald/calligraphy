import React, {useEffect} from "react";
import './InputArea.scss';
import {MAX_LABEL_DEFAULT_SIZE, MIN_LABEL_DEFAULT_SIZE} from "../../../core/utility";

interface InputAreaProps {
    id: string;
    type: 'text' | 'checkbox';
    header?: string;
    widthChangeable?: boolean;
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: () => void;
}

function changeWidth(id: string, isWidthChangeable: boolean) {
    if (isWidthChangeable) {
        const el = document.getElementById(id) as HTMLInputElement;
        const minSize = MIN_LABEL_DEFAULT_SIZE;
        const maxSize = MAX_LABEL_DEFAULT_SIZE;

        el.style.width = minSize + 'px';

        if (el.scrollWidth < minSize) {
            el.style.width = minSize + 2 + 'px';
        } else if (el.scrollWidth > maxSize) {
            el.style.width = maxSize + 2 + 'px';
        } else {
            el.style.width = el.scrollWidth + 2 + 'px';
        }
    }
}

const InputArea = (props: InputAreaProps) => {
    const styles = `inputArea__input inputArea__${props.type}`;

    useEffect(() => {
        changeWidth(props.id, props.widthChangeable);
    }, [props.id, props.widthChangeable]);

    return (
        <>
            {props.header ? (
                <div>
                    <div className="inputArea__header">
                        <p>{props.header}</p>
                    </div>
                    {props.widthChangeable ? (
                        <input
                            id={props.id}
                            className={styles}
                            value={props.value}
                            onChange={props.onChange}
                            type={props.type}
                            placeholder={props.placeholder}
                        />
                    ) : (
                        <input
                            id={props.id}
                            className={styles}
                            value={props.value}
                            onChange={props.onChange}
                            type={props.type}
                            placeholder={props.placeholder}
                        />
                    )}
                </div>
            ) : (
                <>
                    {props.widthChangeable && (
                        <input
                            id={props.id}
                            className={styles}
                            value={props.value}
                            onChange={props.onChange}
                            placeholder={props.placeholder}
                            onClick={props.onKeyDown}
                        />
                    )}
                    {props.type === "checkbox" && (
                        <>
                            <input
                                id={props.id}
                                className={styles}
                                value={props.value}
                                type={props.type}
                                placeholder={props.placeholder}
                                onClick={props.onKeyDown}
                            />
                            <label htmlFor={props.id}></label>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default InputArea;
