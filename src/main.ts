import "./style.css";

const blackTileColor = "#b58863";
const whiteTileColor = "#f0d9b5";
//const highlightColor = "#623b69";
//const highlightOpacity = 0.85;

const white = "white";
const black = "black";

const basicBoard: Piece[] = [
    { pos: { x: 0, y: 0 }, name: "rook", color: white },
    { pos: { x: 1, y: 0 }, name: "knight", color: white },
    { pos: { x: 2, y: 0 }, name: "bishop", color: white },
    { pos: { x: 3, y: 0 }, name: "queen", color: white },
    { pos: { x: 4, y: 0 }, name: "king", color: white },
    { pos: { x: 5, y: 0 }, name: "bishop", color: white },
    { pos: { x: 6, y: 0 }, name: "knight", color: white },
    { pos: { x: 7, y: 0 }, name: "rook", color: white },
    { pos: { x: 0, y: 1 }, name: "pawn", color: white },
    { pos: { x: 1, y: 1 }, name: "pawn", color: white },
    { pos: { x: 2, y: 1 }, name: "pawn", color: white },
    { pos: { x: 3, y: 1 }, name: "pawn", color: white },
    { pos: { x: 4, y: 1 }, name: "pawn", color: white },
    { pos: { x: 5, y: 1 }, name: "pawn", color: white },
    { pos: { x: 6, y: 1 }, name: "pawn", color: white },
    { pos: { x: 7, y: 1 }, name: "pawn", color: white },

    { pos: { x: 0, y: 7 }, name: "rook", color: black },
    { pos: { x: 1, y: 7 }, name: "knight", color: black },
    { pos: { x: 2, y: 7 }, name: "bishop", color: black },
    { pos: { x: 3, y: 7 }, name: "queen", color: black },
    { pos: { x: 4, y: 7 }, name: "king", color: black },
    { pos: { x: 5, y: 7 }, name: "bishop", color: black },
    { pos: { x: 6, y: 7 }, name: "knight", color: black },
    { pos: { x: 7, y: 7 }, name: "rook", color: black },
    { pos: { x: 0, y: 6 }, name: "pawn", color: black },
    { pos: { x: 1, y: 6 }, name: "pawn", color: black },
    { pos: { x: 2, y: 6 }, name: "pawn", color: black },
    { pos: { x: 3, y: 6 }, name: "pawn", color: black },
    { pos: { x: 4, y: 6 }, name: "pawn", color: black },
    { pos: { x: 5, y: 6 }, name: "pawn", color: black },
    { pos: { x: 6, y: 6 }, name: "pawn", color: black },
    { pos: { x: 7, y: 6 }, name: "pawn", color: black },
];

interface FpsContext {
    reportInterval: number;
    lastTime: DOMHighResTimeStamp;
    frames: number;
}

interface GameContext {
    mousePos: { x: number; y: number };
    isMouseDown: boolean;
    fps: FpsContext;
    canvas: HTMLCanvasElement;
    painter: CanvasRenderingContext2D;
    //
    pieces: Piece[];
    boardSize: Size;
    //
    images: Record<string, HTMLImageElement>;
}

type Position = { x: number; y: number };

interface Piece {
    pos: Position;
    name: string;
    color: string;
}

function handleFpsReporting(ctx: FpsContext, currentTime: DOMHighResTimeStamp) {
    if (currentTime - ctx.lastTime > ctx.reportInterval) {
        const fps = ctx.frames / (ctx.reportInterval / 1000);
        console.log(`FPS: ${fps}`);
        ctx.frames = 0;
        ctx.lastTime = currentTime;
    }

    ctx.frames++;
}

function startMouseTracking(ctx: GameContext, canvas: HTMLCanvasElement) {
    canvas.addEventListener("pointermove", (event: any) => {
        const rect = canvas.getBoundingClientRect();

        ctx.mousePos.x = event.clientX - rect.left;
        ctx.mousePos.y = event.clientY - rect.top;
    });
    canvas.addEventListener("pointerdown", () => {
        ctx.isMouseDown = true;
    });
    canvas.addEventListener("pointerup", () => {
        ctx.isMouseDown = false;
    });
}

type Size = { w: number; h: number };

function drawBoard(ctx: GameContext) {
    const tileSize = getTileSize(ctx);

    for (let x = 0; x < ctx.boardSize.w; x++) {
        for (let y = 0; y < ctx.boardSize.h; y++) {
            const color = ((x + y) & 1) == 0 ? blackTileColor : whiteTileColor;
            const pos = getRealPos(ctx, { x, y });

            ctx.painter.fillStyle = color;
            ctx.painter.fillRect(pos.x, pos.y, tileSize.w, tileSize.h);
        }
    }
}

function getTileSize(ctx: GameContext): Size {
    return {
        w: ctx.canvas.width / ctx.boardSize.w,
        h: ctx.canvas.height / ctx.boardSize.h,
    };
}

function getRealPos(ctx: GameContext, boardPos: Position): Position {
    const tileSize = getTileSize(ctx);

    return {
        x: boardPos.x * tileSize.w,
        y: ctx.canvas.height - tileSize.h * (boardPos.y + 1),
    };
}

function getPieceImage(ctx: GameContext, pieceType: string, color: string) {
    return ctx.images[`${color}-${pieceType}`];
}

function drawPieces(ctx: GameContext) {
    ctx.pieces.forEach((piece) => {
        const tileSize = getTileSize(ctx);
        const pos = getRealPos(ctx, piece.pos);

        ctx.painter.drawImage(
            getPieceImage(ctx, piece.name, piece.color),
            pos.x,
            pos.y,
            tileSize.w,
            tileSize.h,
        );
    });
}

function loadImages(): Record<string, HTMLImageElement> {
    function mkImage(path: string): HTMLImageElement {
        const img = new Image();
        img.src = path;

        return img;
    }

    return {
        "black-bishop": mkImage("black-bishop.png"),
        "black-king": mkImage("black-king.png"),
        "black-knight": mkImage("black-knight.png"),
        "black-pawn": mkImage("black-pawn.png"),
        "black-queen": mkImage("black-queen.png"),
        "black-rook": mkImage("black-rook.png"),
        "white-bishop": mkImage("white-bishop.png"),
        "white-king": mkImage("white-king.png"),
        "white-knight": mkImage("white-knight.png"),
        "white-pawn": mkImage("white-pawn.png"),
        "white-queen": mkImage("white-queen.png"),
        "white-rook": mkImage("white-rook.png"),
    };
}

function render(
    ctx: GameContext,
    canvas: HTMLCanvasElement,
    painter: CanvasRenderingContext2D,
    time: DOMHighResTimeStamp,
    onRendered: () => void,
) {
    painter.clearRect(0, 0, canvas.width, canvas.height);

    drawBoard(ctx);
    drawPieces(ctx);

    //draw pointer
    painter.fillStyle = "red";
    painter.fillRect(ctx.mousePos.x - 5, ctx.mousePos.y - 5, 10, 10);

    handleFpsReporting(ctx.fps, time);

    onRendered();
}

function init() {
    const canvas =
        document.querySelector<HTMLCanvasElement>("[js-id='canvas']")!;
    canvas.width = 800;
    canvas.height = 800;
    const painter: CanvasRenderingContext2D = canvas.getContext("2d")!;

    const ctx: GameContext = {
        mousePos: { x: 0, y: 0 },
        isMouseDown: false,
        fps: {
            lastTime: 0,
            frames: 0,
            reportInterval: 10_000,
        },
        canvas,
        painter,
        pieces: basicBoard,
        boardSize: { w: 8, h: 8 },
        images: loadImages(),
    };

    const curriedRender = (time: DOMHighResTimeStamp) => {
        render(ctx, canvas, painter, time, () =>
            requestAnimationFrame(curriedRender),
        );
    };

    startMouseTracking(ctx, canvas);

    requestAnimationFrame(curriedRender);
}

init();
