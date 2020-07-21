import { Color } from './color.js';
import { Display } from './display.js';

export class Rectangle {
    x: number;
    y: number;
    height: number;
    width: number;
    color: Color;

    constructor(pX: number, pY: number, pHeight: number, pWidth: number, pColor: Color) {
        this.x = pX;
        this.y = pY;
        this.height = pHeight;
        this.width = pWidth;
        this.color = pColor;
    }

    draw(display: Display): void {
        display.setColor(this.color);
        const positionData = [
            this.x, this.y, // top left
            this.x + this.width, this.y, // top right
            this.x, this.y + this.height, // bottom left

            this.x, this.y + this.height, // bottom left
            this.x + this.width, this.y, // top right
            this.x + this.width, this.y + this.height // bottom right
        ];
        display.drawTriangles(positionData);
    }

    reset(): void {
        this.x = 0;
        this.y = 0;
    }
}