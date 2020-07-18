const vertexShaderCode = `
    attribute vec2 inputPosition;
    attribute vec2 resolution;

    void main() {
        vec2 normalized = inputPosition / resolution;
        gl_Position = vec4(normalized, 0, 1);
    }
`;

const fragmentShaderCode = `
    precision mediump float;
    uniform vec3 inputColor;

    void main() {
        gl_FragColor = vec4(inputColor / 255.0, 1);
    }
`;

export class Display {
    private readonly container: HTMLElement;
    private readonly canvas: HTMLCanvasElement;
    // private readonly ctx: CanvasRenderingContext2D;
    private readonly glCtx: WebGLRenderingContext;
    private readonly drawCallback: (display: Display, delta: number) => void;

    private currHeight = 0;
    private currWidth = 0;

    private lastFrameTimestamp = 0;

    private _preserveAspectRatio: boolean;

    internalWidth: number;
    internalHeight: number;

    glProgram: WebGLProgram;

    glPositionAttributeLocation: number;
    glPositionBuffer: WebGLBuffer;

    glResolutionAttributeLocation: number;

    glColorUniformLocation: WebGLUniformLocation;

    constructor(
        pCanvas: HTMLCanvasElement,
        pDrawCallback: (display: Display, delta: number) => void,
        pInternalWidth: number,
        pInternalHeight: number,
        pPreserveAspectRatio: boolean
    ) {
        this.canvas = pCanvas;
        this.container = pCanvas.parentElement as HTMLElement;
        // this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.glCtx = this.canvas.getContext('webgl') as WebGLRenderingContext;
        this.drawCallback = pDrawCallback;
        this.internalWidth = pInternalWidth;
        this.internalHeight = pInternalHeight;
        this._preserveAspectRatio = pPreserveAspectRatio;

        this.glProgram = this.glCtx.createProgram() as WebGLProgram;
        const vertexShader = this.glCtx.createShader(this.glCtx.VERTEX_SHADER) as WebGLShader;
        this.glCtx.shaderSource(vertexShader, vertexShaderCode);
        this.glCtx.compileShader(vertexShader);
        this.glCtx.attachShader(this.glProgram, vertexShader);

        const fragmentShader = this.glCtx.createShader(this.glCtx.FRAGMENT_SHADER) as WebGLShader;
        this.glCtx.shaderSource(fragmentShader, fragmentShaderCode);
        this.glCtx.compileShader(fragmentShader);
        this.glCtx.attachShader(this.glProgram, fragmentShader);
        
        this.glCtx.linkProgram(this.glProgram);

        this.glPositionAttributeLocation = this.glCtx.getAttribLocation(this.glProgram, 'inputPosition');
        this.glResolutionAttributeLocation = this.glCtx.getAttribLocation(this.glProgram, 'resolution');
        this.glColorUniformLocation = this.glCtx.getUniformLocation(this.glProgram, 'inputColor') as WebGLUniformLocation;

        this.glPositionBuffer = this.glCtx.createBuffer() as WebGLBuffer;
    }

    tX(value: number): number {
        return value * this.canvas.width / this.internalWidth;
    }

    tY(value: number): number {
        return value * this.canvas.height / this.internalHeight;
    }

    resize(width: number, height: number): void {
        // TODO: do dynamic for real
        // let actualWidth = width;
        // let actualHeight = height;

        // if (this.preserveAspectRatio) {
        //     const scaledHeight = width * this.internalHeight / this.internalWidth;
        //     if (scaledHeight < height) {
        //         actualWidth = width;
        //         actualHeight = scaledHeight;
        //     }
        //     else {
        //         actualWidth = height * this.internalWidth / this.internalHeight;
        //         actualHeight = height;
        //     }
        // }

        // this.canvas.height = actualHeight;
        // this.canvas.width = actualWidth;
        // this.glCtx.viewport(0, 0, this.currWidth, this.currHeight);
    }

    clear(): void {
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.glCtx.clearColor(50 / 255, 54 / 255, 140 / 255, 1);
        this.glCtx.clear(this.glCtx.COLOR_BUFFER_BIT);
    }

    start(): void {
        // TODO: do dynamic for real
        this.glCtx.viewport(0, 0, 800, 600);
        this.nextFrame();
    }

    private nextFrame(): void {
        window.requestAnimationFrame((t: DOMHighResTimeStamp) => this.draw(t));
    }

    private draw(timestamp: DOMHighResTimeStamp): void {
        // TODO: Try and move around
        this.glCtx.useProgram(this.glProgram);

        const windowHeight = this.container.clientHeight;
        const windowWidth = this.container.clientWidth;
    
        if (this.currHeight !== windowHeight || this.currWidth !== windowWidth) {
            this.resize(windowWidth, windowHeight);
            this.currHeight = windowHeight;
            this.currWidth = windowWidth;
        }

        this.clear();

        this.glCtx.vertexAttrib2f(this.glResolutionAttributeLocation, this.internalWidth, this.internalHeight);

        this.drawCallback(this, timestamp - this.lastFrameTimestamp);
        this.lastFrameTimestamp = timestamp;
        this.nextFrame();
    }

    get context(): WebGLRenderingContext {
        return this.glCtx;
    }

    get preserveAspectRatio(): boolean {
        return this._preserveAspectRatio;
    }
    set preserveAspectRatio(pValue: boolean) {
        this._preserveAspectRatio = pValue;
        this.resize(this.currWidth, this.currHeight);
    }
}