import { Color } from './color.js';

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

    const vec4 scale = vec4(255.0, 255.0, 255.0, 1.0);
    uniform vec4 inputColor;

    void main() {
        gl_FragColor = inputColor / scale;
    }
`;

export class Display {
    private readonly container: HTMLElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly glCtx: WebGLRenderingContext;
    private readonly drawCallback: (display: Display, delta: number) => void;

    private lastFrameTimestamp = 0;

    private _preserveAspectRatio: boolean;
    private _internalWidth: number;
    private _internalHeight: number;

    private readonly glResolutionAttributeLocation: number;

    private readonly glPositionAttributeLocation: number;
    private readonly glPositionBuffer: WebGLBuffer;

    private readonly glColorUniformLocation: WebGLUniformLocation;

    clearColor: Color;

    constructor(
        pCanvas: HTMLCanvasElement,
        pDrawCallback: (display: Display, delta: number) => void,
        pInternalWidth: number,
        pInternalHeight: number,
        pPreserveAspectRatio: boolean,
        pClearColor: Color
    ) {
        this.canvas = pCanvas;
        this.container = pCanvas.parentElement as HTMLElement;
        this.glCtx = this.canvas.getContext('webgl') as WebGLRenderingContext;
        this.drawCallback = pDrawCallback;
        this._internalWidth = pInternalWidth;
        this._internalHeight = pInternalHeight;
        this._preserveAspectRatio = pPreserveAspectRatio;
        this.clearColor = pClearColor;

        const glProgram = this.glCtx.createProgram() as WebGLProgram;

        this.createShader(vertexShaderCode, this.glCtx.VERTEX_SHADER, glProgram, 'vertex');
        this.createShader(fragmentShaderCode, this.glCtx.FRAGMENT_SHADER, glProgram, 'fragment');

        this.glCtx.linkProgram(glProgram);

        this.glPositionAttributeLocation = this.glCtx.getAttribLocation(glProgram, 'inputPosition');
        this.glResolutionAttributeLocation = this.glCtx.getAttribLocation(glProgram, 'resolution');
        this.glColorUniformLocation = this.glCtx.getUniformLocation(glProgram, 'inputColor') as WebGLUniformLocation;

        this.glPositionBuffer = this.glCtx.createBuffer() as WebGLBuffer;

        this.glCtx.useProgram(glProgram);

        this.glCtx.enable(this.glCtx.BLEND);
        // KWAS TODO: Better understand alpha stuff
        this.glCtx.blendFunc(this.glCtx.SRC_ALPHA, this.glCtx.ONE_MINUS_SRC_ALPHA);
    }

    resize(): void {
        let actualWidth = this.container.clientWidth;
        let actualHeight = this.container.clientHeight;

        if (this.preserveAspectRatio) {
            const scaledHeight = actualWidth * this._internalHeight / this._internalWidth;
            if (scaledHeight < actualHeight) {
                actualHeight = scaledHeight;
            }
            else {
                actualWidth = actualHeight * this._internalWidth / this._internalHeight;
            }
        }

        this.canvas.height = actualHeight;
        this.canvas.width = actualWidth;
        this.glCtx.viewport(0, 0, actualWidth, actualHeight);
        this.glCtx.vertexAttrib2f(this.glResolutionAttributeLocation, this._internalWidth, this._internalHeight);
    }

    clear(): void {
        this.glCtx.clearColor(
            this.clearColor.red / 255,
            this.clearColor.green / 255,
            this.clearColor.blue / 255,
            this.clearColor.alpha
        );
        this.glCtx.clear(this.glCtx.COLOR_BUFFER_BIT);
    }

    start(): void {
        this.resize();
        this.nextFrame();
    }

    setColor(color: Color): void {
        this.glCtx.uniform4f(this.glColorUniformLocation, color.red, color.green, color.blue, color.alpha);
    }

    drawTriangles(points: number[]): void {
        this.glCtx.enableVertexAttribArray(this.glPositionAttributeLocation);
        this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, this.glPositionBuffer);
        this.glCtx.vertexAttribPointer(
            this.glPositionAttributeLocation,
            2,
            this.glCtx.FLOAT,
            false,
            0,
            0
        );
        this.glCtx.bufferData(this.glCtx.ARRAY_BUFFER, new Float32Array(points), this.glCtx.DYNAMIC_DRAW);
        this.glCtx.drawArrays(this.glCtx.TRIANGLES, 0, points.length / 2);
    }

    set internalHeight(pValue: number) {
        this._internalHeight = pValue;
        this.resize();
    }

    set internalWidth(pValue: number) {
        this._internalWidth = pValue;
        this.resize();
    }

    get preserveAspectRatio(): boolean {
        return this._preserveAspectRatio;
    }
    set preserveAspectRatio(pValue: boolean) {
        this._preserveAspectRatio = pValue;
        this.resize();
    }

    private nextFrame(): void {
        window.requestAnimationFrame((t: DOMHighResTimeStamp) => this.draw(t));
    }

    private draw(timestamp: DOMHighResTimeStamp): void {
        this.clear();

        this.drawCallback(this, timestamp - this.lastFrameTimestamp);
        this.lastFrameTimestamp = timestamp;
        this.nextFrame();
    }

    private createShader(source: string, type: number, glProgram: WebGLProgram, shaderName: string): void {
        const shader = this.glCtx.createShader(type) as WebGLShader;
        this.glCtx.shaderSource(shader, source);
        this.glCtx.compileShader(shader);

        const compileStatus = this.glCtx.getShaderParameter(shader, this.glCtx.COMPILE_STATUS);
        if (!compileStatus) {
            console.log('Error compiling shader: ' + shaderName);
            console.log(this.glCtx.getShaderInfoLog(shader));
        }

        this.glCtx.attachShader(glProgram, shader);
    }
}