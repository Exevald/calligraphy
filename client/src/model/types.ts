enum LetterStyle {
    'solid',
    'dashed',
    'dotted',
}

interface Point {
    x: number;
    y: number;
}

interface DrawingStroke {
    points: Point[];
    style: LetterStyle;
    color: string;
    lineWidth: number;
}

interface Character {
    char: string;
    style: LetterStyle;
    fontSize: number;
    fontFamily: string;
    color: string;
    isBold: boolean;
    isItalic: boolean;
}

interface TextLine {
    id: string;
    y: number;
    characters: Character[];
    cursorPosition: number;
    isActive: boolean;
    lineStyle: LetterStyle;
    lineFontSize: number;
    lineFontFamily: string;
}

interface Cursor {
    x: number;
    y: number;
    lineId: string;
    position: number;
    isVisible: boolean;
}

interface TextSelection {
    startLineId: string;
    endLineId: string;
    startPosition: number;
    endPosition: number;
    isActive: boolean;
}

interface HandwritingSettings {
    lineSpacing: number;
    lineColor: string;
    backgroundColor: string;
    paperSize: 'A4' | 'A5';
    showGuidelines: boolean;
}

export {LetterStyle}
export type {Point, DrawingStroke, Character, TextLine, Cursor, TextSelection, HandwritingSettings}