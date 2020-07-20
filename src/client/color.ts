export class Color {
    // Between 0 and 255
    readonly red: number;
    readonly green: number;
    readonly blue: number;

    // between 0 and 1
    readonly alpha: number;

    constructor(pRed: number, pGreen: number, pBlue: number, pAlpha = 1.0) {
        this.red = pRed;
        this.green = pGreen;
        this.blue = pBlue;
        this.alpha = pAlpha;
    }

}