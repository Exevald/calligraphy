import React, {useState} from 'react';
import HandwritingCanvas from '../../components/HandwritingCanvas/HandwritingCanvas';
import {LetterStyle} from "../../../model/types";
import TopPanel from "../../components/TopPanel/TopPanel";
import "./Editor.scss";
import InputArea from "../../components/InputArea/InputArea";

const Editor = () => {
    const [title, setTitle] = useState('Прописи');
    const [text, setText] = useState('Текст прописей');
    const [style, setStyle] = useState<LetterStyle>(LetterStyle.solid);
    const [lineSpacing, setLineSpacing] = useState(50);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let style: LetterStyle;
        switch (event.target.value) {
            case 'solid': {
                style = LetterStyle.solid
                break;
            }
            case 'dashed': {
                style = LetterStyle.dashed
                break;
            }
            case 'dotted': {
                style = LetterStyle.dotted;
                break;
            }
        }
        setStyle(style);
    };

    const handleLineSpacingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLineSpacing(Number(event.target.value));
    };

    const user = {
        imgUrl: ''
    };

    return (
        <div>
            <TopPanel userData={user}/>
            <div className={"editor__settings-wrapper"}>
                <div className={"editor__tool-bar"}>
                    <InputArea
                        id={"pageTitle"}
                        type={"text"}
                        header={"Название страницы"}
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <div className={"editor__word-style-settings"}>
                        <label>
                            <input
                                type="radio"
                                value="solid"
                                checked={style === LetterStyle.solid}
                                onChange={handleStyleChange}
                            />
                            Сплошной
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="dashed"
                                checked={style === LetterStyle.dashed}
                                onChange={handleStyleChange}
                            />
                            Пунктир
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="dotted"
                                checked={style === LetterStyle.dotted}
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
                <HandwritingCanvas text={text} style={style} lineSpacing={lineSpacing} title={title}/>
            </div>
        </div>
    );
};

export default Editor;