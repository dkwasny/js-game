import { Color } from './color.js';
import { Entity } from './entity.js';

const vertexPositionStr = 'vertexPosition';
const entityPositionStr = 'entityPosition';
const entitySizeStr = 'entitySize';
const entityResolutionStr = 'entityResolution';
const internalResolutionStr = 'internalResolution';
const inputColorStr = 'inputColor';
const vertexTextureCoordStr = 'vertexTextureCoord';
const fragmentTextureCoordStr = 'fragmentTextureCoord';
const textureSamplerStr = 'textureSampler';

const vertexShaderCode = `
    attribute vec2 ${vertexPositionStr};
    attribute vec2 ${vertexTextureCoordStr};

    uniform vec2 ${entityPositionStr};
    uniform vec2 ${entitySizeStr};
    uniform vec2 ${entityResolutionStr};
    uniform vec2 ${internalResolutionStr};

    varying vec2 ${fragmentTextureCoordStr};

    void main() {
        // Scale the vertex based on the entity's actual Size
        // and internal resolution.
        vec2 scaledVert = ${vertexPositionStr} * ${entitySizeStr} / ${entityResolutionStr};

        // Translate the vertex based on the entity's position.
        vec2 translatedVert = scaledVert + ${entityPositionStr};

        // Convert the vertex to clip space (-1.0 <= vertex <= 1.0)
        // so OpenGL can render it.
        vec2 clipVert = translatedVert / ${internalResolutionStr};

        // Additional translation to move 0,0 to the
        // bottom left of the window.
        vec2 normalizedToBottomLeft = clipVert * 2.0 - 1.0;

        // Pass the 2D coordintes off in a vec4
        gl_Position = vec4(normalizedToBottomLeft, 0, 1);

        // Pass the texture coordinate off to the fragment shader
        ${fragmentTextureCoordStr} = ${vertexTextureCoordStr};
    }
`;

const fragmentShaderCode = `
    precision mediump float;

    const vec4 scale = vec4(255.0, 255.0, 255.0, 1.0);

    uniform vec4 ${inputColorStr};
    uniform sampler2D ${textureSamplerStr};

    varying vec2 ${fragmentTextureCoordStr};

    void main() {
        // Scale the primitive color from 0-255 scale to 0.0-1.0
        // for OpenGL.
        vec4 primitive = ${inputColorStr} / scale;

        // Get the respective color from the texture based
        // on the provided texture coordinate
        vec4 texture = texture2D(${textureSamplerStr}, ${fragmentTextureCoordStr});

        // Blend the texture color onto the primitive color
        // based on a formula I found on Wikipedia.
        // https://en.wikipedia.org/wiki/Alpha_compositing
        float alphaP = primitive.a;
        float alphaT = texture.a;
        float alphaOut = alphaT + alphaP * (1.0 - alphaT);

        vec3 colorP = primitive.rgb;
        vec3 colorT = texture.rgb;
        vec3 colorOut = ((colorT * alphaT) + (colorP * alphaP * (1.0 - alphaT))) / alphaOut;

        // Pass the output color and alpha values in a vec4
        gl_FragColor = vec4(colorOut, alphaOut);
    }
`;

export class Display {
    private readonly container: HTMLElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly glCtx: WebGLRenderingContext;
    private readonly drawCallback: (display: Display, delta: number) => void;

    private lastFrameTimestamp = 0;

    preserveAspectRatio: boolean;
    internalWidth: number;
    internalHeight: number;

    clearColor: Color;

    private readonly glInternalResolutionUnif: WebGLUniformLocation;
    private readonly glEntityResolutionUnif: WebGLUniformLocation;
    private readonly glEntitySizeUnif: WebGLUniformLocation;
    private readonly glEntityPositionUnif: WebGLUniformLocation;
    private readonly glVertexPositionAttr: number;

    private readonly glVertexPositionBuffer: WebGLBuffer;
    private readonly glColorUnif: WebGLUniformLocation;

    private readonly glVertexTextureCoordAttr: number;
    private readonly glTextureSamplerUnif: WebGLUniformLocation;
    private readonly glVertexTextureCoordBuffer: WebGLBuffer;

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
        this.glCtx = this.canvas.getContext('webgl', { alpha: false, antialias: false }) as WebGLRenderingContext;
        this.drawCallback = pDrawCallback;
        this.internalWidth = pInternalWidth;
        this.internalHeight = pInternalHeight;
        this.preserveAspectRatio = pPreserveAspectRatio;
        this.clearColor = pClearColor;

        const glProgram = this.glCtx.createProgram() as WebGLProgram;

        this.createShader(vertexShaderCode, this.glCtx.VERTEX_SHADER, glProgram, 'vertex');
        this.createShader(fragmentShaderCode, this.glCtx.FRAGMENT_SHADER, glProgram, 'fragment');

        this.glCtx.linkProgram(glProgram);

        this.glVertexPositionAttr = this.glCtx.getAttribLocation(glProgram, vertexPositionStr);
        this.glVertexTextureCoordAttr = this.glCtx.getAttribLocation(glProgram, vertexTextureCoordStr);

        this.glEntityPositionUnif = this.glCtx.getUniformLocation(glProgram, entityPositionStr) as WebGLUniformLocation;
        this.glEntitySizeUnif = this.glCtx.getUniformLocation(glProgram, entitySizeStr) as WebGLUniformLocation;
        this.glEntityResolutionUnif = this.glCtx.getUniformLocation(glProgram, entityResolutionStr) as WebGLUniformLocation;
        this.glInternalResolutionUnif = this.glCtx.getUniformLocation(glProgram, internalResolutionStr) as WebGLUniformLocation;
        this.glColorUnif = this.glCtx.getUniformLocation(glProgram, inputColorStr) as WebGLUniformLocation;
        this.glTextureSamplerUnif = this.glCtx.getUniformLocation(glProgram, textureSamplerStr) as WebGLUniformLocation;

        this.glVertexPositionBuffer = this.glCtx.createBuffer() as WebGLBuffer;
        this.glVertexTextureCoordBuffer = this.glCtx.createBuffer() as WebGLBuffer;

        this.glCtx.useProgram(glProgram);

        this.glCtx.enable(this.glCtx.BLEND);
        this.glCtx.blendFunc(this.glCtx.SRC_ALPHA, this.glCtx.ONE_MINUS_SRC_ALPHA);
    }

    resize(): void {
        let actualWidth = this.container.clientWidth;
        let actualHeight = this.container.clientHeight;

        if (this.preserveAspectRatio) {
            const scaledHeight = actualWidth * this.internalHeight / this.internalWidth;
            if (scaledHeight < actualHeight) {
                actualHeight = scaledHeight;
            }
            else {
                actualWidth = actualHeight * this.internalWidth / this.internalHeight;
            }

            this.canvas.height = actualHeight;
            this.canvas.width = actualWidth;
        }

        this.glCtx.viewport(0, 0, actualWidth, actualHeight);
        this.glCtx.uniform2f(this.glInternalResolutionUnif, this.internalWidth, this.internalHeight);
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

    drawEntity(entity: Entity): void {
        if (entity.needsTexture()) {
            entity.loadedTexture = this.createTexture(entity);
        }

        const color = entity.color;
        this.glCtx.uniform4f(this.glColorUnif, color.red, color.green, color.blue, color.alpha);
        this.glCtx.uniform2f(this.glEntityPositionUnif, entity.x, entity.y);
        this.glCtx.uniform2f(this.glEntitySizeUnif, entity.width, entity.height);
        this.glCtx.uniform2f(this.glEntityResolutionUnif, entity.internalWidth, entity.internalHeight);

        if (entity.textureData.length > 0) {
            const texture = entity.loadedTexture as WebGLTexture;
            this.setupTexture(entity.textureCoords, texture);
        }

        this.drawTriangles(entity.verticies);
    }

    private createTexture(entity: Entity): WebGLTexture {
        const texture = this.glCtx.createTexture() as WebGLTexture;
        this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, texture);

        this.glCtx.texImage2D(
            this.glCtx.TEXTURE_2D,
            0,
            this.glCtx.RGBA,
            entity.textureWidth,
            entity.textureHeight,
            0,
            this.glCtx.RGBA,
            this.glCtx.UNSIGNED_BYTE,
            entity.textureData
        );

        this.glCtx.texParameteri(
            this.glCtx.TEXTURE_2D,
            this.glCtx.TEXTURE_MIN_FILTER,
            this.glCtx.NEAREST
        );
        this.glCtx.texParameteri(
            this.glCtx.TEXTURE_2D,
            this.glCtx.TEXTURE_MAG_FILTER,
            this.glCtx.NEAREST
        );
        // this.glCtx.generateMipmap(this.glCtx.TEXTURE_2D);

        return texture;
    }

    private setupTexture(coords: Float32Array, texture: WebGLTexture): void {
        this.glCtx.enableVertexAttribArray(this.glVertexTextureCoordAttr);
        this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, this.glVertexTextureCoordBuffer);
        this.glCtx.vertexAttribPointer(
            this.glVertexTextureCoordAttr,
            2,
            this.glCtx.FLOAT,
            false,
            0,
            0
        );
        this.glCtx.bufferData(this.glCtx.ARRAY_BUFFER, coords, this.glCtx.DYNAMIC_DRAW);

        this.glCtx.activeTexture(this.glCtx.TEXTURE0);
        this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, texture);
        this.glCtx.uniform1i(this.glTextureSamplerUnif, 0);
    }

    private drawTriangles(points: Float32Array): void {
        this.glCtx.enableVertexAttribArray(this.glVertexPositionAttr);
        this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, this.glVertexPositionBuffer);
        this.glCtx.vertexAttribPointer(
            this.glVertexPositionAttr,
            2,
            this.glCtx.FLOAT,
            false,
            0,
            0
        );
        this.glCtx.bufferData(this.glCtx.ARRAY_BUFFER, points, this.glCtx.DYNAMIC_DRAW);
        this.glCtx.drawArrays(this.glCtx.TRIANGLES, 0, points.length / 2);
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
