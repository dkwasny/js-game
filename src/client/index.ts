import { Display } from './display.js';
import { Color } from './color.js';
import { Rectangle } from './rectangle.js';

const setRes = function() {
    const input = prompt('New Internal Resolution (w:h)');
    if (input != null) {
        const [newW,newH] = input.split(':');
        display.internalWidth = +newW;
        display.internalHeight = +newH;
        display.resize();
        foregroundSquare.reset();
    }
};

const togglePreserveAspectRatio = function() {
    console.log(display.preserveAspectRatio);
    display.preserveAspectRatio = !display.preserveAspectRatio;
    display.resize();
};

const backgroundSquare = new Rectangle(0, 0, 10, 10, new Color(57, 167, 106, 1.0));
const foregroundSquare = new Rectangle(0, 0, 10, 10, new Color(198, 93, 109, 0.75));

const handleKeyPress = function(event: KeyboardEvent) {
    const key = event.key;
    switch(key) {
    case 'ArrowLeft':
        foregroundSquare.x -= 1;
        break;
    case 'ArrowRight':
        foregroundSquare.x += 1;
        break;
    case 'ArrowUp':
        foregroundSquare.y += 1;
        break;
    case 'ArrowDown':
        foregroundSquare.y -= 1;
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
    backgroundSquare.draw(display);
    foregroundSquare.draw(display);
};

const backgroundColor = new Color(50, 54, 140);
const display = new Display(document.getElementById('kwasCanvas') as HTMLCanvasElement, draw, 100, 100, true, backgroundColor);
display.start();

window.addEventListener('keydown', handleKeyPress);

const resize = function() {
    display.resize();
};
window.onresize = resize;