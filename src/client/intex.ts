let canvas = document.getElementById('kwasCanvas') as HTMLCanvasElement;
let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
let mainDiv = document.getElementById('mainDiv') as HTMLElement;
let header = document.getElementById('header') as HTMLElement;

let wCanvasRatio = 1;
let hCanvasRatio = 1;

let setRatio = function() {
    let input = prompt("New Aspect Ratio (w:h)");
    if (input != null) {
        let [newW,newH] = input.split(':');
        wCanvasRatio = +newW;
        hCanvasRatio = +newH;
    }
}

let items = [];

let square = {
    x: 0.5,
    y: 0.5,
    height: 0.25,
    width: 0.25,
    colorHex: '#c65d6d',
    draw: function(canvasHeight: number, canvasWidth: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.colorHex;

        let sX = this.x * canvasWidth;
        let sY = this.y * canvasHeight;
        let sHeight = this.height * canvasHeight;
        let sWidth = this.width * canvasWidth;

        ctx.fillRect(sX, sY, sWidth, sHeight);
    }
};

let handleKeyPress = function(event: KeyboardEvent) {
    let key = event.key;
    switch(key) {
        case "ArrowLeft":
            square.x -= 0.01;
            break;
        case "ArrowRight":
            square.x += 0.01;
            break;
        case "ArrowUp":
            square.y -= 0.01;
            break;
        case "ArrowDown":
            square.y += 0.01;
            break;
        case "a":
            setRatio();
            break;
    }
};

let draw = function() {
    let windowHeight = mainDiv.clientHeight - header.clientHeight;
    let windowWidth = mainDiv.clientWidth;

    let newCanvasHeight = 0;
    let newCanvasWidth = 0;
    
    let wGrowth = windowWidth / wCanvasRatio;
    let hGrowth = windowHeight / hCanvasRatio;

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

    let height = canvas.height;
    let width = canvas.width;

    square.draw(height, width, ctx);
};

window.setInterval(draw, 16);
window.addEventListener('keydown', handleKeyPress);