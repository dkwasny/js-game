import { Color } from './color.js';

export abstract class Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;

    internalWidth: number;
    internalHeight: number;
    verticies: number[];

    constructor(
        pX: number,
        pY: number,
        pWidth: number,
        pHeight: number,
        pColor: Color,
        pInternalWidth: number,
        pInternalHeight: number,
        pVerticies: number[]
    ) {
        this.x = pX;
        this.y = pY;
        this.width = pWidth;
        this.height = pHeight;
        this.color = pColor;
        this.internalWidth = pInternalWidth;
        this.internalHeight = pInternalHeight;
        this.verticies = pVerticies;
    }

    reset(): void {
        this.x= 0;
        this.y = 0;
    }
}
