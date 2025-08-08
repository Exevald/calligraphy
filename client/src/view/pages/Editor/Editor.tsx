import React, {useState, useEffect} from 'react';
import {HandwritingCanvas} from '../../components/HandwritingCanvas/HandwritingCanvas';
import {LetterStyle} from "../../../model/types";
import TopPanel from "../../components/TopPanel/TopPanel";
import "./Editor.scss";
import InputArea from "../../components/InputArea/InputArea";

const Editor: React.FC = () => {
    const [title, setTitle] = useState('Прописи');
    const [style, setStyle] = useState<LetterStyle>(LetterStyle.solid);
    const [lineSpacing, setLineSpacing] = useState(50);

    useEffect(() => {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                console.warn('localStorage недоступен в Editor');
                return;
            }
            
            const savedTitle = localStorage.getItem('editorTitle');
            const savedStyle = localStorage.getItem('editorStyle');
            const savedLineSpacing = localStorage.getItem('editorLineSpacing');
            
            console.log('Загружаем настройки редактора:', { savedTitle, savedStyle, savedLineSpacing });
            
            if (savedTitle) setTitle(savedTitle);
            if (savedStyle) setStyle(Number(savedStyle) as LetterStyle);
            if (savedLineSpacing) setLineSpacing(Number(savedLineSpacing));
        } catch (error) {
            console.error('Ошибка загрузки настроек редактора:', error);
        }
    }, []);

    useEffect(() => {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                console.warn('localStorage недоступен в Editor');
                return;
            }
            
            console.log('Сохраняем настройки редактора:', { title, style, lineSpacing });
            localStorage.setItem('editorTitle', title);
            localStorage.setItem('editorStyle', style.toString());
            localStorage.setItem('editorLineSpacing', lineSpacing.toString());
        } catch (error) {
            console.error('Ошибка сохранения настроек редактора:', error);
        }
    }, [title, style, lineSpacing]);

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
        <div className="editor">
            <TopPanel userData={user}/>
            <div className="editor__content">
                <div className="editor__sidebar">
                    <div className="editor__settings">
                        <h3>Настройки прописей</h3>
                        
                        <InputArea
                            id={"pageTitle"}
                            type={"text"}
                            header={"Название страницы"}
                            value={title}
                            onChange={handleTitleChange}
                        />
                        
                        <div className="editor__setting-group">
                            <label className="editor__setting-label">Стиль письма:</label>
                            <div className="editor__word-style-settings">
                                <label className="editor__radio-label">
                                    <input
                                        type="radio"
                                        value="solid"
                                        checked={style === LetterStyle.solid}
                                        onChange={handleStyleChange}
                                    />
                                    <span>Сплошной</span>
                                </label>
                                <label className="editor__radio-label">
                                    <input
                                        type="radio"
                                        value="dashed"
                                        checked={style === LetterStyle.dashed}
                                        onChange={handleStyleChange}
                                    />
                                    <span>Пунктир</span>
                                </label>
                                <label className="editor__radio-label">
                                    <input
                                        type="radio"
                                        value="dotted"
                                        checked={style === LetterStyle.dotted}
                                        onChange={handleStyleChange}
                                    />
                                    <span>Точки</span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="editor__setting-group">
                            <label className="editor__setting-label">
                                Расстояние между строками: {lineSpacing}px
                            </label>
                            <input
                                type="range"
                                value={lineSpacing}
                                onChange={handleLineSpacingChange}
                                min="40"
                                max="100"
                                className="editor__range-input"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="editor__canvas-area">
                    <HandwritingCanvas 
                        lineSpacing={lineSpacing} 
                        title={title}
                        onLineSpacingChange={setLineSpacing}
                        letterStyle={style}
                    />
                </div>
            </div>
        </div>
    );
};

export default Editor;