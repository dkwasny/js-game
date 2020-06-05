import { Display } from './display.js';

const display = new Display(document.getElementById('kwasCanvas') as HTMLCanvasElement, 100, 100, true);

const mainDiv = document.getElementById('mainDiv') as HTMLElement;
const header = document.getElementById('header') as HTMLElement;

let currHeight = 0;
let currWidth = 0;

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
    display.preserveAspectRatio = !display.preserveAspectRatio;
    display.resize(currWidth, currHeight);
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
            display.tX(this.x),
            display.tY(this.y),
            display.tX(this.width),
            display.tY(this.height)
        );
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
        square.y -= 1;
        break;
    case 'ArrowDown':
        square.y += 1;
        break;
    case 'a':
        setRes();
        break;
    case 'p':
        togglePreserveAspectRatio();
        break;
    }
};

const draw = function(timestamp: DOMHighResTimeStamp) {
    const windowHeight = mainDiv.clientHeight - header.clientHeight;
    const windowWidth = mainDiv.clientWidth;

    if (currHeight !== windowHeight || currWidth !== windowWidth) {
        display.resize(windowWidth, windowHeight);
        currHeight = windowHeight;
        currWidth = windowWidth;
    }
    display.clear();
    square.draw(display);
    window.requestAnimationFrame(draw);
};

window.requestAnimationFrame(draw);
window.addEventListener('keydown', handleKeyPress);