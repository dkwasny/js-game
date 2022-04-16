import { Color } from './color.js';
import { Entity } from './entity.js';

const internalWidth = 1;
const internalHeight = 1;
function getVerticies(): number[] {
    return [
        0, 0,
        1, 0,
        0, 1,

        1, 0,
        0, 1,
        1, 1
    ];
}

function getTextureData(): number[] {
    return [
        0, 0, 255, 50,
        0, 255, 0, 50,
        255, 0, 0, 50,
        255, 255, 255, 50
    ];
}

export class Rectangle extends Entity {
    constructor(pX: number, pY: number, pWidth: number, pHeight: number, pColor: Color) {
        super(pX, pY, pWidth, pHeight, pColor, internalWidth, internalHeight, getVerticies(), 2, 2, getVerticies(), getTextureData());
    }
}
