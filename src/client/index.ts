import { Display } from './display.js';
import { Color } from './color.js';
import { Rectangle } from './rectangle.js';
import { LetterA } from './LetterA.js';

const setRes = function() {
    const input = prompt('New Internal Resolution (w:h)');
    if (input != null) {
        const [newW,newH] = input.split(':');
        display.internalWidth = +newW;
        display.internalHeight = +newH;
        display.resize();
        foregroundALetter.reset();
    }
};

const setSize = function() {
    const input = prompt('New Size (w:h)');
    if (input != null) {
        const [newW,newH] = input.split(':');
        foregroundALetter.width = +newW;
        foregroundALetter.height = +newH;
    }
};


const togglePreserveAspectRatio = function() {
    console.log(display.preserveAspectRatio);
    display.preserveAspectRatio = !display.preserveAspectRatio;
    display.resize();
};

const backgroundSquare = new Rectangle(45, 45, 10, 10, new Color(57, 167, 106, 0.50));
// const foregroundALetter = new LetterA(47, 45, 6, 10, new Color(198, 93, 109, 0.75));
const foregroundALetter = new Rectangle(47, 45, 6, 10, new Color(198, 93, 109, 0.75));

const handleKeyPress = function(event: KeyboardEvent) {
    const key = event.key;
    switch(key) {
    case 'ArrowLeft':
        foregroundALetter.x -= 1;
        break;
    case 'ArrowRight':
        foregroundALetter.x += 1;
        break;
    case 'ArrowUp':
        foregroundALetter.y += 1;
        break;
    case 'ArrowDown':
        foregroundALetter.y -= 1;
        break;
    case 'a':
        setRes();
        break;
    case 's':
        setSize();
        break;
    case 'p':
        togglePreserveAspectRatio();
        break;
    }
};

const draw = function(display: Display, delta: number) {
    display.drawEntity(backgroundSquare);
    display.drawEntity(foregroundALetter);
};

const backgroundColor = new Color(50, 54, 140);
const display = new Display(document.getElementById('kwasCanvas') as HTMLCanvasElement, draw, 100, 100, true, backgroundColor);
display.start();

window.addEventListener('keydown', handleKeyPress);

const resize = function() {
    display.resize();
};
window.onresize = resize;
