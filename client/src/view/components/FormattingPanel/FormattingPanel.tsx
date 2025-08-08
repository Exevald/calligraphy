import React from 'react';
import {LetterStyle} from '../../../model/types';
import './FormattingPanel.scss';

interface FormattingPanelProps {
    isVisible: boolean;
    onStyleChange: (style: LetterStyle) => void;
    onFontSizeChange: (size: number) => void;
    onColorChange: (color: string) => void;
    currentStyle: LetterStyle;
    currentFontSize: number;
    currentColor: string;
}

const FormattingPanel: React.FC<FormattingPanelProps> = ({
    isVisible,
    onStyleChange,
    onFontSizeChange,
    onColorChange,
    currentStyle,
    currentFontSize,
    currentColor
}) => {
    if (!isVisible) return null;

    const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32];
    const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

    return (
        <div className="formatting-panel">
            <div className="formatting-panel__section">
                <label>Стиль письма:</label>
                <div className="formatting-panel__style-buttons">
                    <button
                        className={`formatting-panel__style-btn ${currentStyle === LetterStyle.solid ? 'active' : ''}`}
                        onClick={() => onStyleChange(LetterStyle.solid)}
                        title="Сплошной"
                    >
                        А
                    </button>
                    <button
                        className={`formatting-panel__style-btn ${currentStyle === LetterStyle.dashed ? 'active' : ''}`}
                        onClick={() => onStyleChange(LetterStyle.dashed)}
                        title="Пунктир"
                    >
                        А
                    </button>
                    <button
                        className={`formatting-panel__style-btn ${currentStyle === LetterStyle.dotted ? 'active' : ''}`}
                        onClick={() => onStyleChange(LetterStyle.dotted)}
                        title="Точки"
                    >
                        А
                    </button>
                </div>
            </div>

            <div className="formatting-panel__section">
                <label>Размер шрифта:</label>
                <select
                    value={currentFontSize}
                    onChange={(e) => onFontSizeChange(Number(e.target.value))}
                    className="formatting-panel__select"
                >
                    {fontSizes.map(size => (
                        <option key={size} value={size}>{size}px</option>
                    ))}
                </select>
            </div>

            <div className="formatting-panel__section">
                <label>Цвет:</label>
                <div className="formatting-panel__color-picker">
                    {colors.map(color => (
                        <button
                            key={color}
                            className={`formatting-panel__color-btn ${currentColor === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => onColorChange(color)}
                            title={color}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FormattingPanel; 