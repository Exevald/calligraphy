import React, { useState } from 'react';
import HandwritingCanvas from '../../components/HandwritingCanvas/HandwritingCanvas';
import {LetterStyle} from "../../../model/types";

const EditorPage = () => {
    const [text, setText] = useState('Текст прописи');
    const [style, setStyle] = useState<LetterStyle>('solid');
    const [lineSpacing, setLineSpacing] = useState(50);

    const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStyle(event.target.value as LetterStyle);
    };

    const handleLineSpacingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLineSpacing(Number(event.target.value));
    };

    return (
        <div>
            <h1>Генератор прописей</h1>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введите текст"
                width={1000}
                height={500}
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
                        value="outlined"
                        checked={style === 'outlined'}
                        onChange={handleStyleChange}
                    />
                    Контур
                </label>
            </div>
            <div>
                <label>Расстояние между строками: </label>
                <input
                    type="number"
                    value={lineSpacing}
                    onChange={handleLineSpacingChange}
                    min="40"
                    max="100"
                />
            </div>
            <HandwritingCanvas text={text} style={style} lineSpacing={lineSpacing} />
        </div>
    );
};

export default EditorPage;