import {useEffect, useRef} from 'react';
import {LetterStyle} from '../../../model/types';
import './HandwritingCanvas.scss'
import { jsPDF } from 'jspdf';

interface HandwritingProps {
    title: string,
    text: string;
    style: LetterStyle;
    lineSpacing: number;
}

const HandwritingCanvas = (props: HandwritingProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = 794;
                canvas.height = 1123;

                ctx.font = '40px Pacifico, cursive';
                ctx.textBaseline = 'middle';
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'black';
                ctx.fillStyle = 'white';

                const startY = 120;
                let xPos = 20;
                let yPos = startY;

                const maxWidth = canvas.width - 40;

                drawPracticeLines(ctx, canvas.width, canvas.height);

                for (let i = 0; i < props.text.length; i++) {
                    const letter = props.text[i];
                    const letterWidth = ctx.measureText(letter).width;

                    if (xPos + letterWidth + 20 > maxWidth) {
                        xPos = 20;
                        yPos += props.lineSpacing;
                    }

                    drawLetter(ctx, letter, xPos, yPos, props.style);

                    xPos += letterWidth + 5;
                }
            }
        }
    }, [props.text, props.style, props.lineSpacing]);

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
        }
    };

    const drawPracticeLines = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        let currentY = 80;
        while (currentY < canvasHeight) {
            ctx.beginPath();
            ctx.moveTo(20, currentY);
            ctx.lineTo(canvasWidth - 20, currentY);
            ctx.stroke();
            currentY += props.lineSpacing;
        }
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const dataUrl = canvas.toDataURL('image/png', 1.0);
                const pdf = new jsPDF();
                const width = pdf.internal.pageSize.getWidth();
                const height = pdf.internal.pageSize.getHeight();

                pdf.setFillColor(255, 255, 255);
                pdf.rect(0, 0, width, height, 'F');

                pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);

                pdf.save( props.title + ".pdf");
            }
        }
    };



    return (
        <div>
            <button onClick={downloadImage}>Скачать изображение</button>
            <canvas className={"handwritingCanvas__canvas-wrapper"} ref={canvasRef}/>
        </div>
    );
};

export default HandwritingCanvas;