import React, {useState} from 'react';
import './SettingsPopover.scss';

interface SettingsPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    fontSize: number;
    onFontSizeChange: (size: number) => void;
    lineSpacing: number;
    onLineSpacingChange: (spacing: number) => void;
    position: {x: number; y: number};
}

const SettingsPopover: React.FC<SettingsPopoverProps> = ({
    isOpen,
    onClose,
    fontSize,
    onFontSizeChange,
    lineSpacing,
    onLineSpacingChange,
    position
}) => {
    const [localFontSize, setLocalFontSize] = useState(fontSize);
    const [localLineSpacing, setLocalLineSpacing] = useState(lineSpacing);

    const handleSave = () => {
        onFontSizeChange(localFontSize);
        onLineSpacingChange(localLineSpacing);
        onClose();
    };

    const handleCancel = () => {
        setLocalFontSize(fontSize);
        setLocalLineSpacing(lineSpacing);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="settings-popover__overlay" onClick={handleCancel} />
            <div 
                className="settings-popover"
                style={{
                    left: position.x,
                    top: position.y
                }}
            >
                <div className="settings-popover__header">
                    <h3>Настройки</h3>
                    <button 
                        className="settings-popover__close"
                        onClick={handleCancel}
                    >
                        ×
                    </button>
                </div>
                
                <div className="settings-popover__content">
                    <div className="settings-popover__setting">
                        <label>Размер шрифта:</label>
                        <div className="settings-popover__font-sizes">
                            {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                                <button
                                    key={size}
                                    className={`settings-popover__font-size ${localFontSize === size ? 'active' : ''}`}
                                    onClick={() => setLocalFontSize(size)}
                                >
                                    {size}px
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="settings-popover__setting">
                        <label>Расстояние между строками:</label>
                        <div className="settings-popover__spacing-options">
                            {[40, 50, 60, 70, 80, 90, 100].map(spacing => (
                                <button
                                    key={spacing}
                                    className={`settings-popover__spacing ${localLineSpacing === spacing ? 'active' : ''}`}
                                    onClick={() => setLocalLineSpacing(spacing)}
                                >
                                    {spacing}px
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="settings-popover__footer">
                    <button 
                        className="settings-popover__button settings-popover__button--cancel"
                        onClick={handleCancel}
                    >
                        Отмена
                    </button>
                    <button 
                        className="settings-popover__button settings-popover__button--save"
                        onClick={handleSave}
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </>
    );
};

export default SettingsPopover; 