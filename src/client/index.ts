import { Display } from './Display.js';


const setRes = function() {
    const input = prompt('New Internal Resolution (w:h)');
    if (input != null) {
        const [newW,newH] = input.split(':');
        display.internalWidth = +newW;
        display.internalHeight = +newH;
        square.reset();
    }
};

const togglePreserveAspectRatio = function() {
    console.log(display.preserveAspectRatio);
    display.preserveAspectRatio = !display.preserveAspectRatio;
};

const square = {
    x: 0,
    y: 0,
    height: 10,
    width: 10,
    colorHex: '#c65d6d',
    draw: function(display: Display) {
        const glCtx = display.context;

        glCtx.uniform3f(display.glColorUniformLocation, 198, 93, 109);

        glCtx.enableVertexAttribArray(display.glPositionAttributeLocation);
        glCtx.bindBuffer(glCtx.ARRAY_BUFFER, display.glPositionBuffer);
        glCtx.vertexAttribPointer(
            display.glPositionAttributeLocation,
            2,
            glCtx.FLOAT,
            false,
            0,
            0
        );

        const positionData = new Float32Array([
            this.x, this.y, // top left
            this.x + this.width, this.y, // top right
            this.x, this.y + this.height, // bottom left

            this.x, this.y + this.height, // bottom left
            this.x + this.width, this.y, // top right
            this.x + this.width, this.y + this.height // bottom right
        ]);

        glCtx.bufferData(glCtx.ARRAY_BUFFER, positionData, glCtx.DYNAMIC_DRAW);

        glCtx.drawArrays(glCtx.TRIANGLES, 0, positionData.length / 2);
    },
    reset: function() {
        this.x = 0;
        this.y = 0;
    }
};

const handleKeyPress = function(event: KeyboardEvent) {
    const key = event.key;
    switch(key) {
    case 'ArrowLeft':
        square.x -= 1;
        break;
    case 'ArrowRight':
        square.x += 1;
        break;
    case 'ArrowUp':
        square.y += 1;
        break;
    case 'ArrowDown':
        square.y -= 1;
        break;
    case 'a':
        setRes();
        break;
    case 'p':
        togglePreserveAspectRatio();
        break;
    }
};

const draw = function(display: Display, delta: number) {
    square.draw(display);
};

const canvas = document.getElementById('kwasCanvas') as HTMLCanvasElement;

const display = new Display(document.getElementById('kwasCanvas') as HTMLCanvasElement, draw, 100, 100, true);
display.start();

window.addEventListener('keydown', handleKeyPress);

const resize = function() {
    display.resize();
};
window.onresize = resize;