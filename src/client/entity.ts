import { Color } from './color.js';

export abstract class Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;

    internalWidth: number;
    internalHeight: number;
    verticies: Float32Array;
    textureWidth: number;
    textureHeight: number;
    textureCoords: Float32Array;
    textureData: Uint8Array;

    loadedTexture: WebGLTexture | null;

    constructor(
        pX: number,
        pY: number,
        pWidth: number,
        pHeight: number,
        pColor: Color,
        pInternalWidth: number,
        pInternalHeight: number,
        pVerticies: number[],
        pTextureWidth = 0,
        pTextureHeight = 0,
        pTextureCoords: number[] = [],
        pTextureData: number[] = []
    ) {
        this.x = pX;
        this.y = pY;
        this.width = pWidth;
        this.height = pHeight;
        this.color = pColor;
        this.internalWidth = pInternalWidth;
        this.internalHeight = pInternalHeight;
        this.verticies = new Float32Array(pVerticies);
        this.textureWidth = pTextureWidth;
        this.textureHeight = pTextureHeight;
        this.textureCoords = new Float32Array(pTextureCoords);
        this.textureData = new Uint8Array(pTextureData);
        this.loadedTexture = null;
    }

    reset(): void {
        this.x= 0;
        this.y = 0;
    }

    needsTexture(): boolean {
        return this.loadedTexture === null && this.textureData.length > 0;
    }
}
