import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {Point, TextLine, Cursor, HandwritingSettings, LetterStyle, Character, TextSelection} from '../../../model/types';
import './HandwritingCanvas.scss';
import {jsPDF} from 'jspdf';
import SettingsPopover from '../SettingsPopover/SettingsPopover';
import FormattingPanel from '../FormattingPanel/FormattingPanel';

interface HandwritingCanvasProps {
    title: string;
    lineSpacing: number;
    onLineSpacingChange: (spacing: number) => void;
    letterStyle: LetterStyle;
}

interface PageState {
    textLines: TextLine[];
    history: TextLine[][];
    historyIndex: number;
    fontSize: number;
    currentFormatting: {
        style: LetterStyle;
        fontSize: number;
        color: string;
    };
}

export const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({title, lineSpacing, onLineSpacingChange, letterStyle}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [textLines, setTextLines] = useState<TextLine[]>([]);
    const [cursor, setCursor] = useState<Cursor | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsPosition, setSettingsPosition] = useState({x: 0, y: 0});
    const [history, setHistory] = useState<TextLine[][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [selection, setSelection] = useState<TextSelection | null>(null);
    const [isFormattingPanelVisible, setIsFormattingPanelVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentFormatting, setCurrentFormatting] = useState({
        style: LetterStyle.solid,
        fontSize: 16,
        color: '#000000'
    });
    const [settings] = useState<HandwritingSettings>({
        lineSpacing: lineSpacing,
        lineColor: '#000000',
        backgroundColor: '#ffffff',
        paperSize: 'A4',
        showGuidelines: true
    });

    const handwritingFont = 'Kalam, cursive';

    const saveToLocalStorage = useCallback((state: PageState) => {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                console.warn('localStorage недоступен');
                return;
            }
            
            console.log('Сохранение в localStorage:', state);
            localStorage.setItem('handwritingPageState', JSON.stringify(state));
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error);
        }
    }, []);

    const loadFromLocalStorage = useCallback((): PageState | null => {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                console.warn('localStorage недоступен');
                return null;
            }
            
            const saved = localStorage.getItem('handwritingPageState');
            if (saved) {
                console.log('Загрузка из localStorage:', saved);
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Ошибка загрузки из localStorage:', error);
        }
        return null;
    }, []);

    useEffect(() => {
        const savedState = loadFromLocalStorage();
        if (savedState) {
            console.log('Восстанавливаем состояние:', savedState);
            setTextLines(savedState.textLines);
            setHistory(savedState.history);
            setHistoryIndex(savedState.historyIndex);
            setFontSize(savedState.fontSize);
            setCurrentFormatting(savedState.currentFormatting);
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (!isInitialized) return;
        
        const state: PageState = {
            textLines,
            history,
            historyIndex,
            fontSize,
            currentFormatting
        };
        saveToLocalStorage(state);
    }, [textLines, history, historyIndex, fontSize, currentFormatting, isInitialized]);

    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;
    const MARGIN_LEFT = 40;
    const MARGIN_RIGHT = 40;
    const START_Y = 120;

    const writingLines = useMemo(() => {
        const lines: {y: number, id: string}[] = [];
        let currentY = START_Y;
        let lineId = 0;

        while (currentY < A4_HEIGHT - 50) {
            lines.push({
                y: currentY,
                id: `line_${lineId}`
            });
            currentY += lineSpacing;
            lineId++;
        }

        return lines;
    }, [lineSpacing]);

    const createCharacter = (char: string): Character => ({
        char,
        style: currentFormatting.style,
        fontSize: currentFormatting.fontSize,
        fontFamily: handwritingFont,
        color: currentFormatting.color,
        isBold: false,
        isItalic: false
    });

    const saveToHistory = useCallback((newTextLines: TextLine[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...newTextLines]);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = A4_WIDTH;
        canvas.height = A4_HEIGHT;
        
        canvas.style.width = '100%';
        canvas.style.maxWidth = '794px';
        canvas.style.height = 'auto';
        
        redrawCanvas();
    }, [textLines, settings, title, cursor, fontSize, letterStyle]);

    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawPracticeLines(ctx);
        drawTitle(ctx);
        drawTextLines(ctx);
        drawCursor(ctx);

        drawSelection(ctx);
    }, [cursor, settings, title, textLines, fontSize, letterStyle, selection]);

    const drawPracticeLines = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = settings.lineColor;
        ctx.lineWidth = 1;

        writingLines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(MARGIN_LEFT, line.y);
            ctx.lineTo(A4_WIDTH - MARGIN_RIGHT, line.y);
            ctx.stroke();

            if (settings.showGuidelines) {
                ctx.globalAlpha = 0.3;
                ctx.lineWidth = 0.5;
                
                ctx.beginPath();
                ctx.moveTo(MARGIN_LEFT, line.y - lineSpacing / 3);
                ctx.lineTo(A4_WIDTH - MARGIN_RIGHT, line.y - lineSpacing / 3);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(MARGIN_LEFT, line.y + lineSpacing / 3);
                ctx.lineTo(A4_WIDTH - MARGIN_RIGHT, line.y + lineSpacing / 3);
                ctx.stroke();

                ctx.globalAlpha = 1;
                ctx.lineWidth = 1;
            }
        });
    };

    const drawTitle = (ctx: CanvasRenderingContext2D) => {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(title, A4_WIDTH / 2, 40);
        
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('ФИО:  _________________________________', 40, 70);
        ctx.fillText('Дата:  _______________', A4_WIDTH - 200, 70);
    };

    const drawTextLines = (ctx: CanvasRenderingContext2D) => {
        textLines.forEach(line => {
            let currentX = MARGIN_LEFT;
            
            line.characters.forEach(character => {
                ctx.font = `${character.fontSize}px ${character.fontFamily}`;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';

                if (character.style === LetterStyle.solid) {
                    ctx.fillStyle = character.color;
                    ctx.fillText(character.char, currentX, line.y);
                } else if (character.style === LetterStyle.dashed) {
                    ctx.strokeStyle = character.color;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 2]);
                    ctx.strokeText(character.char, currentX, line.y);
                    ctx.setLineDash([]);
                } else if (character.style === LetterStyle.dotted) {
                    ctx.strokeStyle = character.color;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([1, 2]);
                    ctx.strokeText(character.char, currentX, line.y);
                    ctx.setLineDash([]);
                }

                currentX += ctx.measureText(character.char).width;
            });
        });
    };

    const drawCursor = (ctx: CanvasRenderingContext2D) => {
        if (!cursor || !cursor.isVisible) return;

        const activeLine = textLines.find(line => line.id === cursor.lineId);
        if (!activeLine) return;

        let cursorX = MARGIN_LEFT;
        for (let i = 0; i < cursor.position && i < activeLine.characters.length; i++) {
            ctx.font = `${activeLine.characters[i].fontSize}px ${activeLine.characters[i].fontFamily}`;
            cursorX += ctx.measureText(activeLine.characters[i].char).width;
        }

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cursorX, cursor.y - fontSize);
        ctx.lineTo(cursorX, cursor.y);
        ctx.stroke();
    };

    const drawSelection = (ctx: CanvasRenderingContext2D) => {
        if (!selection || !selection.isActive) return;

        const startLine = textLines.find(line => line.id === selection.startLineId);
        const endLine = textLines.find(line => line.id === selection.endLineId);
        
        if (!startLine || !endLine) return;

        ctx.fillStyle = 'rgba(0, 123, 255, 0.3)';
        ctx.strokeStyle = 'rgba(0, 123, 255, 0.5)';
        ctx.lineWidth = 1;

        if (selection.startLineId === selection.endLineId) {
            const line = startLine;
            let startX = MARGIN_LEFT;
            let endX = MARGIN_LEFT;

            for (let i = 0; i < line.characters.length; i++) {
                const char = line.characters[i];
                ctx.font = `${char.fontSize}px ${char.fontFamily}`;
                const charWidth = ctx.measureText(char.char).width;

                if (i < selection.startPosition) {
                    startX += charWidth;
                }
                if (i < selection.endPosition) {
                    endX += charWidth;
                }
            }

            const height = fontSize + 4;
            ctx.fillRect(startX, line.y - height, endX - startX, height);
            ctx.strokeRect(startX, line.y - height, endX - startX, height);
        } else {
            let startX = MARGIN_LEFT;
            for (let i = 0; i < selection.startPosition; i++) {
                const char = startLine.characters[i];
                ctx.font = `${char.fontSize}px ${char.fontFamily}`;
                startX += ctx.measureText(char.char).width;
            }
            const height = fontSize + 4;
            ctx.fillRect(startX, startLine.y - height, A4_WIDTH - MARGIN_RIGHT - startX, height);
            ctx.strokeRect(startX, startLine.y - height, A4_WIDTH - MARGIN_RIGHT - startX, height);

            const middleLines = textLines.filter(line =>
                line.id !== selection.startLineId && 
                line.id !== selection.endLineId &&
                line.y > startLine.y && 
                line.y < endLine.y
            );

            middleLines.forEach(line => {
                ctx.fillRect(MARGIN_LEFT, line.y - height, A4_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, height);
                ctx.strokeRect(MARGIN_LEFT, line.y - height, A4_WIDTH - MARGIN_LEFT - MARGIN_RIGHT, height);
            });

            let endX = MARGIN_LEFT;
            for (let i = 0; i < selection.endPosition; i++) {
                const char = endLine.characters[i];
                ctx.font = `${char.fontSize}px ${char.fontFamily}`;
                endX += ctx.measureText(char.char).width;
            }
            ctx.fillRect(MARGIN_LEFT, endLine.y - height, endX - MARGIN_LEFT, height);
            ctx.strokeRect(MARGIN_LEFT, endLine.y - height, endX - MARGIN_LEFT, height);
        }
    };

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
        const canvas = canvasRef.current;
        if (!canvas) return {x: 0, y: 0};

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const findLineByY = (y: number): {y: number, id: string} | null => {
        return writingLines.find(line => 
            Math.abs(y - line.y) < lineSpacing / 2
        ) || null;
    };

    const calculateCursorPosition = (x: number, line: TextLine): number => {
        const canvas = canvasRef.current;
        if (!canvas) return 0;

        const ctx = canvas.getContext('2d');
        if (!ctx) return 0;

        let currentX = MARGIN_LEFT;
        let position = 0;

        for (let i = 0; i < line.characters.length; i++) {
            const char = line.characters[i];
            ctx.font = `${char.fontSize}px ${char.fontFamily}`;
            const charWidth = ctx.measureText(char.char).width;

            if (x >= currentX && x <= currentX + charWidth) {
                const relativeX = x - currentX;
                if (relativeX > charWidth / 2) {
                    position = i + 1;
                } else {
                    position = i;
                }
                break;
            }

            currentX += charWidth;
            position = i + 1;
        }

        return Math.min(position, line.characters.length);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Element;
            
            if (canvasRef.current &&
                !canvasRef.current.contains(target) && 
                !target.closest('.formatting-panel') &&
                !target.closest('.settings-popover')) {
                setIsTyping(false);
                setCursor(null);
                setSelection(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (e.target !== canvasRef.current) return;
        
        const pos = getMousePos(e);
        const clickedLine = findLineByY(pos.y);

        if (clickedLine) {
            let textLine = textLines.find(line => line.id === clickedLine.id);
            
            if (!textLine) {
                textLine = {
                    id: clickedLine.id,
                    y: clickedLine.y,
                    characters: [],
                    cursorPosition: 0,
                    isActive: true,
                    lineStyle: letterStyle,
                    lineFontSize: fontSize,
                    lineFontFamily: handwritingFont
                };
                const newTextLines = [...textLines, textLine];
                setTextLines(newTextLines);
                saveToHistory(newTextLines);
            } else {
                setTextLines(prev => 
                    prev.map(line => 
                        line.id === clickedLine.id 
                            ? { ...line, isActive: true }
                            : { ...line, isActive: false }
                    )
                );
            }

            const cursorPosition = calculateCursorPosition(pos.x, textLine);

            const newCursor: Cursor = {
                x: pos.x,
                y: clickedLine.y,
                lineId: clickedLine.id,
                position: cursorPosition,
                isVisible: true
            };

            setCursor(newCursor);
            setIsTyping(true);
            setIsDragging(true);
            
            if (e.shiftKey) {
                if (selection) {
                    setSelection({
                        ...selection,
                        endLineId: clickedLine.id,
                        endPosition: cursorPosition,
                        isActive: true
                    });
                } else {
                    setSelection({
                        startLineId: clickedLine.id,
                        endLineId: clickedLine.id,
                        startPosition: cursorPosition,
                        endPosition: cursorPosition,
                        isActive: true
                    });
                }
            } else {
                setSelection(null);
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;

        const pos = getMousePos(e);
        const currentLine = findLineByY(pos.y);

        if (currentLine) {
            const textLine = textLines.find(line => line.id === currentLine.id);
            if (textLine) {
                const newPosition = calculateCursorPosition(pos.x, textLine);
                
                setCursor({
                    x: pos.x,
                    y: currentLine.y,
                    lineId: currentLine.id,
                    position: newPosition,
                    isVisible: true
                });

                if (selection) {
                    setSelection({
                        ...selection,
                        endLineId: currentLine.id,
                        endPosition: newPosition,
                        isActive: true
                    });
                } else {
                    setSelection({
                        startLineId: cursor?.lineId || currentLine.id,
                        endLineId: currentLine.id,
                        startPosition: cursor?.position || 0,
                        endPosition: newPosition,
                        isActive: true
                    });
                }
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!cursor || !isTyping) return;

            const activeLine = textLines.find(line => line.id === cursor.lineId);
            if (!activeLine) return;

            const newCharacters = [...activeLine.characters];
            let newPosition = cursor.position;

            switch (e.key) {
                case 'Backspace':
                    if (selection && selection.isActive) {
                        const result = deleteSelection();
                        if (result) {
                            const { newTextLines, newCursor } = result;
                            setTextLines(newTextLines);
                            setCursor(newCursor);
                            setSelection(null);
                            saveToHistory(newTextLines);
                        }
                        e.preventDefault();
                        return;
                    } else if (newPosition > 0) {
                        newCharacters.splice(newPosition - 1, 1);
                        newPosition--;
                    }
                    break;
                case 'Delete':
                    if (selection && selection.isActive) {
                        const result = deleteSelection();
                        if (result) {
                            const { newTextLines, newCursor } = result;
                            setTextLines(newTextLines);
                            setCursor(newCursor);
                            setSelection(null);
                            saveToHistory(newTextLines);
                        }
                        e.preventDefault();
                        return;
                    } else if (newPosition < newCharacters.length) {
                        newCharacters.splice(newPosition, 1);
                    }
                    break;
                case 'ArrowLeft':
                    if (e.shiftKey) {
                        if (newPosition > 0) {
                            newPosition--;
                            if (!selection) {
                                setSelection({
                                    startLineId: activeLine.id,
                                    endLineId: activeLine.id,
                                    startPosition: newPosition + 1,
                                    endPosition: newPosition + 1,
                                    isActive: true
                                });
                            } else {
                                setSelection({
                                    ...selection,
                                    endPosition: newPosition
                                });
                            }
                        }
                    } else {
                        if (newPosition > 0) {
                            newPosition--;
                        }
                        setSelection(null);
                    }
                    break;
                case 'ArrowRight':
                    if (e.shiftKey) {
                        if (newPosition < newCharacters.length) {
                            newPosition++;
                            if (!selection) {
                                setSelection({
                                    startLineId: activeLine.id,
                                    endLineId: activeLine.id,
                                    startPosition: newPosition - 1,
                                    endPosition: newPosition - 1,
                                    isActive: true
                                });
                            } else {
                                setSelection({
                                    ...selection,
                                    endPosition: newPosition
                                });
                            }
                        }
                    } else {
                        if (newPosition < newCharacters.length) {
                            newPosition++;
                        }
                        setSelection(null);
                    }
                    break;
                case 'Home':
                    if (e.shiftKey) {
                        setSelection({
                            startLineId: activeLine.id,
                            endLineId: activeLine.id,
                            startPosition: 0,
                            endPosition: newPosition,
                            isActive: true
                        });
                    } else {
                        newPosition = 0;
                        setSelection(null);
                    }
                    break;
                case 'End':
                    if (e.shiftKey) {
                        setSelection({
                            startLineId: activeLine.id,
                            endLineId: activeLine.id,
                            startPosition: newPosition,
                            endPosition: newCharacters.length,
                            isActive: true
                        });
                    } else {
                        newPosition = newCharacters.length;
                        setSelection(null);
                    }
                    break;
                case 'Escape':
                    setIsTyping(false);
                    setCursor(null);
                    setSelection(null);
                    return;
                default:
                    if (e.key.length === 1) {
                        if (selection && selection.isActive) {
                            const result = replaceSelection(e.key);
                            if (result) {
                                const { newTextLines, newCursor } = result;
                                setTextLines(newTextLines);
                                setCursor(newCursor);
                                setSelection(null);
                                saveToHistory(newTextLines);
                            }
                            e.preventDefault();
                            return;
                        } else {
                            const newChar = createCharacter(e.key);
                            newCharacters.splice(newPosition, 0, newChar);
                            newPosition++;
                        }
                    }
                    break;
            }

            const newTextLines = textLines.map(line =>
                line.id === cursor.lineId 
                    ? { ...line, characters: newCharacters, cursorPosition: newPosition }
                    : line
            );
            
            setTextLines(newTextLines);
            saveToHistory(newTextLines);

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    let cursorX = MARGIN_LEFT;
                    for (let i = 0; i < newPosition && i < newCharacters.length; i++) {
                        const char = newCharacters[i];
                        ctx.font = `${char.fontSize}px ${char.fontFamily}`;
                        cursorX += ctx.measureText(char.char).width;
                    }

                    setCursor({
                        ...cursor,
                        x: cursorX,
                        position: newPosition
                    });
                }
            }

            e.preventDefault();
        };

        if (isTyping) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [cursor, isTyping, textLines, saveToHistory, selection]);

    const deleteSelection = () => {
        if (!selection || !selection.isActive) return null;

        const newTextLines = [...textLines];
        const startLine = newTextLines.find(line => line.id === selection.startLineId);
        const endLine = newTextLines.find(line => line.id === selection.endLineId);

        if (!startLine || !endLine) return null;

        if (selection.startLineId === selection.endLineId) {
            const line = startLine;
            const newCharacters = [...line.characters];
            const deleteCount = selection.endPosition - selection.startPosition;
            newCharacters.splice(selection.startPosition, deleteCount);
            
            const updatedLine = {
                ...line,
                characters: newCharacters,
                cursorPosition: selection.startPosition
            };

            const lineIndex = newTextLines.findIndex(line => line.id === selection.startLineId);
            newTextLines[lineIndex] = updatedLine;

            const canvas = canvasRef.current;
            let cursorX = MARGIN_LEFT;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    for (let i = 0; i < selection.startPosition && i < newCharacters.length; i++) {
                        const char = newCharacters[i];
                        ctx.font = `${char.fontSize}px ${char.fontFamily}`;
                        cursorX += ctx.measureText(char.char).width;
                    }
                }
            }

            return {
                newTextLines,
                newCursor: {
                    x: cursorX,
                    y: line.y,
                    lineId: line.id,
                    position: selection.startPosition,
                    isVisible: true
                }
            };
        } else {
            const startLineIndex = newTextLines.findIndex(line => line.id === selection.startLineId);
            const endLineIndex = newTextLines.findIndex(line => line.id === selection.endLineId);

            const newStartCharacters = [...startLine.characters];
            newStartCharacters.splice(selection.startPosition);
            newTextLines[startLineIndex] = {
                ...startLine,
                characters: newStartCharacters,
                cursorPosition: selection.startPosition
            };

            const newEndCharacters = [...endLine.characters];
            newEndCharacters.splice(0, selection.endPosition);
            newTextLines[endLineIndex] = {
                ...endLine,
                characters: newEndCharacters,
                cursorPosition: 0
            };

            for (let i = startLineIndex + 1; i < endLineIndex; i++) {
                newTextLines[i] = {
                    ...newTextLines[i],
                    characters: [],
                    cursorPosition: 0
                };
            }

            const canvas = canvasRef.current;
            let cursorX = MARGIN_LEFT;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    for (let i = 0; i < selection.startPosition && i < newStartCharacters.length; i++) {
                        const char = newStartCharacters[i];
                        ctx.font = `${char.fontSize}px ${char.fontFamily}`;
                        cursorX += ctx.measureText(char.char).width;
                    }
                }
            }

            return {
                newTextLines,
                newCursor: {
                    x: cursorX,
                    y: startLine.y,
                    lineId: startLine.id,
                    position: selection.startPosition,
                    isVisible: true
                }
            };
        }
    };

    const replaceSelection = (newChar: string) => {
        if (!selection || !selection.isActive) return null;

        const result = deleteSelection();
        if (!result) return null;

        const { newTextLines, newCursor } = result;
        const line = newTextLines.find(l => l.id === newCursor.lineId);
        
        if (line) {
            const newCharacters = [...line.characters];
            const newCharObj = createCharacter(newChar);
            newCharacters.splice(newCursor.position, 0, newCharObj);
            
            const updatedLine = {
                ...line,
                characters: newCharacters,
                cursorPosition: newCursor.position + 1
            };

            const lineIndex = newTextLines.findIndex(l => l.id === newCursor.lineId);
            newTextLines[lineIndex] = updatedLine;

            return {
                newTextLines,
                newCursor: {
                    ...newCursor,
                    position: newCursor.position + 1
                }
            };
        }

        return result;
    };

    useEffect(() => {
        if (!cursor) return;

        const interval = setInterval(() => {
            setCursor(prev => prev ? { ...prev, isVisible: !prev.isVisible } : null);
        }, 500);

        return () => clearInterval(interval);
    }, [cursor]);

    const openSettings = (e: React.MouseEvent) => {
        e.preventDefault();
        setSettingsPosition({x: e.clientX, y: e.clientY});
        setIsSettingsOpen(true);
    };

    const handleFontSizeChange = (newFontSize: number) => {
        setFontSize(newFontSize);
        setCurrentFormatting(prev => ({ ...prev, fontSize: newFontSize }));
        
        if (selection && selection.isActive) {
            applyFormattingToSelection({ fontSize: newFontSize });
        }
    };

    const handleLineSpacingChange = (newLineSpacing: number) => {
        onLineSpacingChange(newLineSpacing);
        
        const newTextLines = textLines.map(line => {
            const lineIndex = parseInt(line.id.split('_')[1]);
            const newY = START_Y + (lineIndex * newLineSpacing);
            
            return {
                ...line,
                y: newY
            };
        });
        
        setTextLines(newTextLines);
        
        if (cursor) {
            const cursorLineIndex = parseInt(cursor.lineId.split('_')[1]);
            const newCursorY = START_Y + (cursorLineIndex * newLineSpacing);
            
            setCursor({
                ...cursor,
                y: newCursorY
            });
        }
        
        saveToHistory(newTextLines);
    };

    const handleStyleChange = (style: LetterStyle) => {
        setCurrentFormatting(prev => ({ ...prev, style }));
        
        if (selection && selection.isActive) {
            applyFormattingToSelection({ style });
        }
    };

    const handleColorChange = (color: string) => {
        setCurrentFormatting(prev => ({ ...prev, color }));
        
        if (selection && selection.isActive) {
            applyFormattingToSelection({ color });
        }
    };

    const applyFormattingToSelection = (formatting: Partial<Character>) => {
        if (!selection || !selection.isActive) return;

        const newTextLines = [...textLines];
        
        if (selection.startLineId === selection.endLineId) {
            const line = newTextLines.find(l => l.id === selection.startLineId);
            if (line) {
                const newCharacters = [...line.characters];
                
                for (let i = selection.startPosition; i < selection.endPosition; i++) {
                    if (newCharacters[i]) {
                        newCharacters[i] = { ...newCharacters[i], ...formatting };
                    }
                }
                
                const lineIndex = newTextLines.findIndex(l => l.id === selection.startLineId);
                newTextLines[lineIndex] = {
                    ...line,
                    characters: newCharacters
                };
            }
        } else {
            const startLine = newTextLines.find(l => l.id === selection.startLineId);
            const endLine = newTextLines.find(l => l.id === selection.endLineId);
            
            if (startLine) {
                const newStartCharacters = [...startLine.characters];
                for (let i = selection.startPosition; i < newStartCharacters.length; i++) {
                    if (newStartCharacters[i]) {
                        newStartCharacters[i] = { ...newStartCharacters[i], ...formatting };
                    }
                }
                
                const startLineIndex = newTextLines.findIndex(l => l.id === selection.startLineId);
                newTextLines[startLineIndex] = {
                    ...startLine,
                    characters: newStartCharacters
                };
            }
            
            if (endLine) {
                const newEndCharacters = [...endLine.characters];
                for (let i = 0; i < selection.endPosition; i++) {
                    if (newEndCharacters[i]) {
                        newEndCharacters[i] = { ...newEndCharacters[i], ...formatting };
                    }
                }
                
                const endLineIndex = newTextLines.findIndex(l => l.id === selection.endLineId);
                newTextLines[endLineIndex] = {
                    ...endLine,
                    characters: newEndCharacters
                };
            }
            
            const middleLines = newTextLines.filter(line =>
                line.id !== selection.startLineId && 
                line.id !== selection.endLineId &&
                line.y > (startLine?.y || 0) && 
                line.y < (endLine?.y || 0)
            );
            
            middleLines.forEach(line => {
                const newCharacters = line.characters.map(char => ({ ...char, ...formatting }));
                const lineIndex = newTextLines.findIndex(l => l.id === line.id);
                newTextLines[lineIndex] = {
                    ...line,
                    characters: newCharacters
                };
            });
        }
        
        setTextLines(newTextLines);
        saveToHistory(newTextLines);
    };

    const exportToPDF = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
        pdf.save(`${title || 'handwriting'}.pdf`);
    };

    const toggleFormattingPanel = () => {
        setIsFormattingPanelVisible(!isFormattingPanelVisible);
    };

    return (
        <div className="handwriting-canvas">
            <div className="handwriting-canvas__toolbar">
                <button 
                    onClick={toggleFormattingPanel}
                    className={`handwriting-canvas__button ${isFormattingPanelVisible ? 'active' : ''}`}
                >
                    Форматирование
                </button>
                <button 
                    onClick={openSettings}
                    className="handwriting-canvas__button"
                >
                    Настройки
                </button>
                <button 
                    onClick={exportToPDF}
                    className="handwriting-canvas__button"
                >
                    Экспорт в PDF
                </button>
            </div>
            
            <div className="handwriting-canvas__container">
                <canvas
                    ref={canvasRef}
                    className="handwriting-canvas__canvas"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{
                        cursor: 'text'
                    }}
                />
                <div className="handwriting-canvas__instructions">
                    Кликните на любую строку для начала ввода текста
                </div>
            </div>

            <SettingsPopover
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                fontSize={fontSize}
                onFontSizeChange={handleFontSizeChange}
                lineSpacing={lineSpacing}
                onLineSpacingChange={handleLineSpacingChange}
                position={settingsPosition}
            />

            <FormattingPanel
                isVisible={isFormattingPanelVisible}
                onStyleChange={handleStyleChange}
                onFontSizeChange={handleFontSizeChange}
                onColorChange={handleColorChange}
                currentStyle={currentFormatting.style}
                currentFontSize={currentFormatting.fontSize}
                currentColor={currentFormatting.color}
            />
        </div>
    );
};