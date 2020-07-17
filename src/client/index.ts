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

const draw = function(display: Display, delta: number) {
    square.draw(display);
};

const display = new Display(document.getElementById('kwasCanvas') as HTMLCanvasElement, draw, 100, 100, true);
display.start();

window.addEventListener('keydown', handleKeyPress);