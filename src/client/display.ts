export class Display {
    private readonly container: HTMLElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly drawCallback: (display: Display, delta: number) => void;

    private currHeight = 0;
    private currWidth = 0;

    private lastFrameTimestamp = 0;

    private _preserveAspectRatio: boolean;

    internalWidth: number;
    internalHeight: number;

    constructor(
        pCanvas: HTMLCanvasElement,
        pDrawCallback: (display: Display, delta: number) => void,
        pInternalWidth: number,
        pInternalHeight: number,
        pPreserveAspectRatio: boolean
    ) {
        this.canvas = pCanvas;
        this.container = pCanvas.parentElement as HTMLElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.drawCallback = pDrawCallback;
        this.internalWidth = pInternalWidth;
        this.internalHeight = pInternalHeight;
        this._preserveAspectRatio = pPreserveAspectRatio;
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

    start(): void {
        this.nextFrame();
    }

    private nextFrame(): void {
        window.requestAnimationFrame((t: DOMHighResTimeStamp) => this.draw(t));
    }

    private draw(timestamp: DOMHighResTimeStamp): void {
        const windowHeight = this.container.clientHeight;
        const windowWidth = this.container.clientWidth;
    
        if (this.currHeight !== windowHeight || this.currWidth !== windowWidth) {
            this.resize(windowWidth, windowHeight);
            this.currHeight = windowHeight;
            this.currWidth = windowWidth;
        }

        this.clear();
        this.drawCallback(this, timestamp - this.lastFrameTimestamp);
        this.lastFrameTimestamp = timestamp;
        this.nextFrame();
    }

    get context(): CanvasRenderingContext2D {
        return this.ctx;
    }

    get preserveAspectRatio(): boolean {
        return this._preserveAspectRatio;
    }
    set preserveAspectRatio(pValue: boolean) {
        this._preserveAspectRatio = pValue;
        this.resize(this.currWidth, this.currHeight);
    }
}