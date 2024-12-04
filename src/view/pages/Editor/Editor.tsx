import React, {useState} from 'react';
import HandwritingCanvas from '../../components/HandwritingCanvas/HandwritingCanvas';
import {LetterStyle} from "../../../model/types";
import TopPanel from "../../components/TopPanel/TopPanel";
import "./Editor.scss"
import InputArea from "../../components/InputArea/InputArea";

const Editor = () => {
    const [text, setText] = useState('Текст прописи');
    const [style, setStyle] = useState<LetterStyle>('solid');
    const [lineSpacing, setLineSpacing] = useState(50);

    const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStyle(event.target.value as LetterStyle);
    };

    const handleLineSpacingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLineSpacing(Number(event.target.value));
    };

    const user = {
        imgUrl: ''
    }

    return (
        <div>
            <TopPanel userData={user}/>
            <div className={"editor__settings-wrapper"}>
                <div className={"editor__tool-bar"}>
                    <InputArea id={"pageTitle"} type={"text"} header={"Название страницы"}/>
                    <InputArea id={"pageInstructions"} type={"text"} header={"Инструкции для написания"}/>
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
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Введите текст"
                    />
                </div>
                <HandwritingCanvas text={text} style={style} lineSpacing={lineSpacing} title={"Handwriting Practice"}/>
            </div>
        </div>
    );
};

export default Editor;