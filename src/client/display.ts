export class Display {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    internalWidth: number;
    internalHeight: number;
    preserveAspectRatio: boolean;

    constructor(pCanvas: HTMLCanvasElement, pInternalWidth: number, pInternalHeight: number, pPreserveAspectRatio: boolean) {
        this.canvas = pCanvas;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.internalWidth = pInternalWidth;
        this.internalHeight = pInternalHeight;
        this.preserveAspectRatio = pPreserveAspectRatio;
    }

    tX(value: number): number {
        return value * this.canvas.width / this.internalWidth;
    }

    tY(value: number): number {
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

    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    get context(): CanvasRenderingContext2D {
        return this.ctx;
    }
}