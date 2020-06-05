const canvas = document.getElementById('kwasCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const mainDiv = document.getElementById('mainDiv') as HTMLElement;
const header = document.getElementById('header') as HTMLElement;

let wCanvasRatio = 1;
let hCanvasRatio = 1;

const setRatio = function() {
    const input = prompt('New Aspect Ratio (w:h)');
    if (input != null) {
        const [newW,newH] = input.split(':');
        wCanvasRatio = +newW;
        hCanvasRatio = +newH;
    }
};

const square = {
    x: 0.5,
    y: 0.5,
    height: 0.25,
    width: 0.25,
    colorHex: '#c65d6d',
    draw: function(canvasHeight: number, canvasWidth: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.colorHex;

        const sX = this.x * canvasWidth;
        const sY = this.y * canvasHeight;
        const sHeight = this.height * canvasHeight;
        const sWidth = this.width * canvasWidth;

        ctx.fillRect(sX, sY, sWidth, sHeight);
    }
};

const handleKeyPress = function(event: KeyboardEvent) {
    const key = event.key;
    switch(key) {
    case 'ArrowLeft':
        square.x -= 0.01;
        break;
    case 'ArrowRight':
        square.x += 0.01;
        break;
    case 'ArrowUp':
        square.y -= 0.01;
        break;
    case 'ArrowDown':
        square.y += 0.01;
        break;
    case 'a':
        setRatio();
        break;
    }
};

const draw = function() {
    const windowHeight = mainDiv.clientHeight - header.clientHeight;
    const windowWidth = mainDiv.clientWidth;

    let newCanvasHeight = 0;
    let newCanvasWidth = 0;
    
    const wGrowth = windowWidth / wCanvasRatio;
    const hGrowth = windowHeight / hCanvasRatio;

    if (wGrowth < hGrowth) {
        newCanvasWidth = windowWidth;
        newCanvasHeight = windowWidth * hCanvasRatio / wCanvasRatio;
    }
    else {
        newCanvasWidth = windowHeight * wCanvasRatio / hCanvasRatio;
        newCanvasHeight = windowHeight;
    }

    canvas.height = newCanvasHeight;
    canvas.width = newCanvasWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const height = canvas.height;
    const width = canvas.width;

    square.draw(height, width, ctx);
};

window.setInterval(draw, 16);
window.addEventListener('keydown', handleKeyPress);