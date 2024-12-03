import React, { useEffect, useRef } from 'react';
import { LetterStyle } from '../../../model/types';

interface HandwritingProps {
    text: string;
    style: LetterStyle;
    lineSpacing: number;
}

const HandwritingCanvas: React.FC<HandwritingProps> = ({ text, style, lineSpacing }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Draw the handwriting text without practice lines on initial render
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = 794; // Ширина канваса
                canvas.height = 1123; // Высота канваса

                ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистить канвас
                ctx.font = '40px Pacifico, cursive'; // Шрифт для текста
                ctx.textBaseline = 'middle'; // Центрирование по вертикали
                ctx.lineWidth = 2; // Толщина линий
                ctx.strokeStyle = 'black'; // Цвет обводки
                ctx.fillStyle = 'white'; // Цвет заливки

                const startY = 120; // Начальная позиция по Y
                let xPos = 20; // Начальная позиция по X
                let yPos = startY; // Начальная позиция по Y

                // Переменные для отслеживания ширины канваса
                const maxWidth = canvas.width - 40; // Отступы по бокам канваса

                // Отрисовка букв
                for (let i = 0; i < text.length; i++) {
                    const letter = text[i];
                    const letterWidth = ctx.measureText(letter).width;

                    // Если буква не помещается в строку, переносим ее на новую строку
                    if (xPos + letterWidth + 20 > maxWidth) {
                        xPos = 20; // Возвращаем xPos в начало
                        yPos += lineSpacing; // Переходим на новую строку
                    }

                    // Отрисовываем текущую букву
                    drawLetter(ctx, letter, xPos, yPos, style);

                    // Обновляем xPos для следующей буквы
                    xPos += letterWidth + 5; // 5 — небольшой промежуток между буквами
                }
            }
        }
    }, [text, style, lineSpacing]);

    const drawLetter = (ctx: CanvasRenderingContext2D, letter: string, x: number, y: number, style: LetterStyle) => {
        if (style === 'solid') {
            ctx.fillText(letter, x, y);
            ctx.strokeText(letter, x, y);
        } else if (style === 'dashed') {
            ctx.setLineDash([3, 1]);
            ctx.strokeText(letter, x, y);
            ctx.setLineDash([]);
        } else if (style === 'dotted') {
            ctx.setLineDash([1, 1]);
            ctx.strokeText(letter, x, y);
            ctx.setLineDash([]);
        } else if (style === 'outlined') {
            ctx.lineWidth = 4;
            ctx.fillStyle = 'white';
            ctx.strokeText(letter, x, y);
        }
    };

    // Draw practice lines only when downloading the image
    const drawPracticeLines = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        let currentY = 80;
        while (currentY < canvasHeight) {
            ctx.beginPath();
            ctx.moveTo(20, currentY);
            ctx.lineTo(canvasWidth - 20, currentY);
            ctx.stroke();
            currentY += lineSpacing;
        }
    };

    // Modify the download function to add practice lines before downloading
    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Draw the practice lines only before downloading the image
                drawPracticeLines(ctx, canvas.width, canvas.height);

                // Generate the image and trigger the download
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'handwriting_practice.png';
                link.click();
            }
        }
    };

    return (
        <div>
            <button onClick={downloadImage}>Скачать изображение</button>
            <canvas ref={canvasRef}/>
        </div>
    );
};

export default HandwritingCanvas;
