import { Color } from './color.js';
import { Entity } from './entity.js';

const internalWidth = 6;
const internalHeight = 10;
function getVerticies(): number[] {
    return [
        0, 0,
        1, 0,
        0, 5,
        1, 0,
        0, 5,
        1, 5,

        6, 0,
        5, 0,
        6, 5,
        5, 0,
        6, 5,
        5, 5,

        0, 5,
        3, 10,
        1, 5,
        3, 10,
        1, 5,
        3, 8,

        6, 5,
        3, 10,
        5, 5,
        3, 10,
        5, 5,
        3, 8,

        1, 4,
        1, 3,
        5, 4,
        1, 3,
        5, 4,
        5, 3
    ];
}

export class LetterA extends Entity {
    constructor(pX: number, pY: number, pWidth: number, pHeight: number, pColor: Color) {
        super(pX, pY, pWidth, pHeight, pColor, internalWidth, internalHeight, getVerticies());
    }
}
