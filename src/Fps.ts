export class Fps {
    public reportInterval: number = 1000;
    public lastTime: DOMHighResTimeStamp = 0;
    public frames: number = 0;

    public handleFpsReporting(currentTime: DOMHighResTimeStamp) {
        if (currentTime - this.lastTime > this.reportInterval) {
            const fps = this.frames / (this.reportInterval / 1000);
            console.log(`FPS: ${fps}`);
            this.frames = 0;
            this.lastTime = currentTime;
        }

        this.frames++;
    }
}
