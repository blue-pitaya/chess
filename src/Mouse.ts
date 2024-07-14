import { Vec2 } from "./Vec2";

interface ClickOccuredEvent {
    type: "ClickOccuredEvent";
    pos: Vec2;
}

interface ReleaseOccuredEvent {
    type: "ReleaseOccuredEvent";
    pos: Vec2;
}

type CustomMouseEvent = ClickOccuredEvent | ReleaseOccuredEvent;

export class Mouse {
    public pos = new Vec2(0, 0);
    public isMouseDown: boolean = false;
    public eventQueue: CustomMouseEvent[] = [];

    public startMouseTracking(canvas: HTMLCanvasElement) {
        const setMousePos = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();

            this.pos.x = event.clientX - rect.left;
            this.pos.y = event.clientY - rect.top;
        };

        canvas.addEventListener("pointerdown", (event) => {
            setMousePos(event);
            this.isMouseDown = true;
            this.eventQueue.push({
                type: "ClickOccuredEvent",
                pos: this.pos.copy(),
            });
        });
        document.addEventListener("pointermove", (event) => {
            setMousePos(event);
        });
        document.addEventListener("pointerup", (event) => {
            setMousePos(event);
            this.isMouseDown = false;
            this.eventQueue.push({
                type: "ReleaseOccuredEvent",
                pos: this.pos.copy(),
            });
        });
    }
}
