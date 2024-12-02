import React, { useRef, useEffect } from 'react';
import {LetterStyle} from "./core/utility";

interface HandwritingProps {
    text: string;
    style: LetterStyle;
}

const HandwritingCanvas: React.FC<HandwritingProps> = ({ text, style }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.font = '40px Arial';
                ctx.textBaseline = 'middle';
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'black';
                ctx.fillStyle = 'white';

                let xPos = 20;
                for (let i = 0; i < text.length; i++) {
                    const letter = text[i];
                    drawLetter(ctx, letter, xPos, style);
                    xPos += 50;
                }
            }
        }
    }, [text, style]);

    const drawLetter = (ctx: CanvasRenderingContext2D, letter: string, x: number, style: LetterStyle) => {
        if (style === 'solid') {
            ctx.fillText(letter, x, 50);
            ctx.strokeText(letter, x, 50);
        } else if (style === 'dashed') {
            ctx.setLineDash([5, 5]); // Пунктир
            ctx.strokeText(letter, x, 50);
            ctx.setLineDash([]); // Сбросить пунктир
        } else if (style === 'dotted') {
            ctx.setLineDash([1, 10]); // Точки
            ctx.strokeText(letter, x, 50);
            ctx.setLineDash([]);
        } else if (style === 'traced') {
            ctx.strokeText(letter, x, 50);
            ctx.globalAlpha = 0.5;
            ctx.strokeText(letter, x + 3, 50); // Легкий контур
            ctx.globalAlpha = 1;
        } else if (style === 'outlined') {
            ctx.lineWidth = 4; // Толщина контура для "outlined"
            ctx.fillStyle = 'white'; // Белый цвет заливки (не будет видно)
            ctx.strokeText(letter, x, 50); // Контур
        }
    };

    return <canvas ref={canvasRef} width={500} height={100} />;
};

export default HandwritingCanvas;
