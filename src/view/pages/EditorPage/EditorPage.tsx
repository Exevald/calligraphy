import React, {useState} from "react";
import HandwritingCanvas from "../../../HandwritingCanvas";
import {LetterStyle} from "../../../core/utility";


const EditorPage = () => {

    const [text, setText] = useState('Привет');
    const [style, setStyle] = useState<LetterStyle>('solid');

    const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStyle(event.target.value as LetterStyle);
    };

    return (
        <div>
            <h1>Генератор прописей</h1>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите текст"
            />
            <div>
                <label>
                    <input
                        type="radio"
                        value="solid"
                        checked={style === 'solid'}
                        onChange={handleStyleChange}
                    />
                    Сплошной
                </label>
                <label>
                    <input
                        type="radio"
                        value="dashed"
                        checked={style === 'dashed'}
                        onChange={handleStyleChange}
                    />
                    Пунктир
                </label>
                <label>
                    <input
                        type="radio"
                        value="dotted"
                        checked={style === 'dotted'}
                        onChange={handleStyleChange}
                    />
                    Точки
                </label>
                <label>
                    <input
                        type="radio"
                        value="traced"
                        checked={style === 'traced'}
                        onChange={handleStyleChange}
                    />
                    Обводка (с тенью)
                </label>
                <label>
                    <input
                        type="radio"
                        value="outlined"
                        checked={style === 'outlined'}
                        onChange={handleStyleChange}
                    />
                    Контур
                </label>
            </div>
            <HandwritingCanvas text={text} style={style} />
        </div>
    )
}

export default EditorPage