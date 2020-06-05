export class Display {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly internalWidth: number;
    private readonly internalHeight: number;
    private readonly preserveAspectRatio: boolean;

    constructor(pCanvas: HTMLCanvasElement, pInternalWidth: number, pInternalHeight: number, pPreserveAspectRatio: boolean) {
        this.canvas = pCanvas;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.internalHeight = pInternalHeight;
        this.internalWidth = pInternalWidth;
        this.preserveAspectRatio = pPreserveAspectRatio;
    }

    transposeX(value: number): number {
        return value * this.canvas.width / this.internalWidth;
    }

    transposeY(value: number): number {
        return value * this.canvas.height / this.internalHeight;
    }

    resize(width: number, height: number): void {
        let actualWidth = width;
        let actualHeight = height;

        if (this.preserveAspectRatio) {
            const scaledHeight = width * this.internalHeight / this.internalWidth;
            if (scaledHeight < height) {
                actualWidth = width;
                actualHeight = scaledHeight;
            }
            else {
                actualWidth = height * this.internalWidth / this.internalHeight;
                actualHeight = height;
            }
        }

        this.canvas.height = actualHeight;
        this.canvas.width = actualWidth;
    }

    get context(): CanvasRenderingContext2D {
        return this.ctx;
    }
}