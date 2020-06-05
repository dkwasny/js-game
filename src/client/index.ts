import { Display } from './display.js';

const display = new Display(document.getElementById('kwasCanvas') as HTMLCanvasElement, 10, 10, true);

const mainDiv = document.getElementById('mainDiv') as HTMLElement;
const header = document.getElementById('header') as HTMLElement;

const setRatio = function() {
    const input = prompt('New Internal Resolution (w:h)');
    if (input != null) {
        const [newW,newH] = input.split(':');
        display.resize(+newW, +newH);
    }
};

const square = {
    x: 0,
    y: 0,
    height: 1,
    width: 1,
    colorHex: '#c65d6d',
    draw: function(display: Display) {
        const ctx = display.context;
        ctx.fillStyle = this.colorHex;

        ctx.fillRect(
            display.transposeX(this.x),
            display.transposeY(this.y),
            display.transposeX(this.width),
            display.transposeY(this.height)
        );
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
        square.y -= 1;
        break;
    case 'ArrowDown':
        square.y += 1;
        break;
    case 'a':
        setRatio();
        break;
    }
};

const draw = function() {
    const windowHeight = mainDiv.clientHeight - header.clientHeight;
    const windowWidth = mainDiv.clientWidth;

    display.resize(windowWidth, windowHeight);

    display.context.clearRect(0, 0, display.transposeX(1920), display.transposeY(1080));

    square.draw(display);
};

window.setInterval(draw, 16);
window.addEventListener('keydown', handleKeyPress);