import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div class="h-full grid items-center justify-center">
  <canvas width="800" height="600" class="bg-black" js-id="canvas">
  </canvas>
</div>
`;

const canvas = document.querySelector<HTMLCanvasElement>("[js-id='canvas']")!;
const painter: CanvasRenderingContext2D = canvas.getContext("2d")!;

painter.fillStyle = "blue";
painter.fillRect(10, 10, 100, 100);

painter.strokeStyle = "red";
painter.lineWidth = 1;
painter.strokeRect(5, 5, 290, 140);

canvas.addEventListener("click", () => {
    console.log(canvas.getBoundingClientRect());
});

interface FpsContext {
    interval: number;
    lastTime: DOMHighResTimeStamp;
    frameCounter: number;
}

interface GameContext {
    fps: FpsContext;
}

function reportFps(ctx: FpsContext, currentTime: DOMHighResTimeStamp) {
    if (currentTime - ctx.lastTime > ctx.interval) {
        const fps = ctx.frameCounter / (ctx.interval / 1000);
        console.log(`FPS: ${fps}`);
        ctx.frameCounter = 0;
        ctx.lastTime = currentTime;
    }
}

const ctx: GameContext = {
    fps: {
        lastTime: 0,
        frameCounter: 0,
        interval: 500,
    },
};

function render(time: DOMHighResTimeStamp) {
    painter.clearRect(0, 0, canvas.width, canvas.height);

    painter.fillStyle = "blue";
    painter.fillRect(100, 100, 50, 50);

    reportFps(ctx.fps, time);

    ctx.fps.frameCounter++;
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
