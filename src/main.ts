import "./style.css";
import {
    basicBoard,
    blackTileColor,
    highlightColor,
    whiteTileColor,
} from "./data";
import { areVecsEqual, Vec2 } from "./utils";
import { GameContext, GameObject, getPossibleMoves, Piece } from "./game";

export interface Tile {
    boardPos: Vec2;
    renderPos: Vec2;
    color: string;
    opacity: number;
    object: GameObject;
    defaultColor: string;
    defaultOpacity: number;
}

interface FpsContext {
    reportInterval: number;
    lastTime: DOMHighResTimeStamp;
    frames: number;
}

interface MouseContext {
    pos: Vec2;
    isMouseDown: boolean;
    clickOccured: boolean;
    releaseOccured: boolean;
    pointerDownPos?: Vec2;
    pointerUpPos?: Vec2;
}

interface AppContext {
    mouse: MouseContext;
    fps: FpsContext;
    game: GameContext;
    //
    tiles: Tile[];
    //
    images: Record<string, HTMLImageElement>;
    draggedPiece?: Piece;
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

function startMouseTracking(ctx: MouseContext, canvas: HTMLCanvasElement) {
    function setMousePos(event: PointerEvent) {
        const rect = canvas.getBoundingClientRect();

        ctx.pos.x = event.clientX - rect.left;
        ctx.pos.y = event.clientY - rect.top;
    }

    canvas.addEventListener("pointerdown", (event) => {
        setMousePos(event);
        ctx.clickOccured = true;
        ctx.isMouseDown = true;
        ctx.pointerDownPos = { x: ctx.pos.x, y: ctx.pos.y };
    });
    document.addEventListener("pointermove", (event) => {
        setMousePos(event);
    });
    document.addEventListener("pointerup", (event) => {
        setMousePos(event);
        ctx.releaseOccured = true;
        ctx.isMouseDown = false;
        ctx.pointerUpPos = { x: ctx.pos.x, y: ctx.pos.y };
    });
}

function getTileSize(boardSize: Vec2, canvas: HTMLCanvasElement): Vec2 {
    return {
        x: canvas.width / boardSize.x,
        y: canvas.height / boardSize.y,
    };
}

function getRealPos(
    boardPos: Vec2,
    boardSize: Vec2,
    canvas: HTMLCanvasElement,
): Vec2 {
    const tileSize = getTileSize(boardSize, canvas);

    return {
        x: boardPos.x * tileSize.x,
        y: canvas.height - tileSize.y * (boardPos.y + 1),
    };
}

function getPieceImage(ctx: AppContext, pieceType: string, color: string) {
    return ctx.images[`${color}-${pieceType}`];
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

function isInBounds(pos: Vec2, object: GameObject): boolean {
    return (
        pos.x >= object.pos.x &&
        pos.x < object.pos.x + object.size.x &&
        pos.y >= object.pos.y &&
        pos.y < object.pos.y + object.size.y
    );
}

function hitTest(clickPos: Vec2, pieces: Piece[]): Piece | undefined {
    return pieces.find((piece) => isInBounds(clickPos, piece.object!));
}

function resetEventFlags(ctx: MouseContext) {
    ctx.clickOccured = false;
    ctx.releaseOccured = false;
}

function render(
    ctx: AppContext,
    canvas: HTMLCanvasElement,
    painter: CanvasRenderingContext2D,
    time: DOMHighResTimeStamp,
) {
    handleFpsReporting(ctx.fps, time);

    // HANDLE MOUSE EVENTS
    if (ctx.mouse.clickOccured) {
        const piece = hitTest(ctx.mouse.pointerDownPos!, ctx.game.pieces);
        if (piece) {
            ctx.draggedPiece = piece;

            const possibleMoves = getPossibleMoves(ctx.draggedPiece, ctx.game);
            possibleMoves.forEach((pos) => {
                const tile = ctx.tiles.find((tile) =>
                    areVecsEqual(tile.boardPos, pos),
                );
                if (tile) {
                    tile.color = highlightColor;
                }
            });
        }
    }

    if (ctx.mouse.releaseOccured) {
        ctx.draggedPiece = undefined;

        // Move pieces to places based on board state
        ctx.game.pieces.forEach((p) => {
            const origPos = getRealPos(p.pos, ctx.game.boardSize, canvas);
            p.object!.pos.x = origPos.x;
            p.object!.pos.y = origPos.y;
        });

        // Reset tiles highlight
        ctx.tiles.forEach((tile) => {
            tile.color = tile.defaultColor;
            tile.opacity = tile.defaultOpacity;
        });
    }

    resetEventFlags(ctx.mouse);

    if (ctx.draggedPiece) {
        const pos = {
            x: ctx.mouse.pos.x - ctx.draggedPiece.object!.size.x / 2,
            y: ctx.mouse.pos.y - ctx.draggedPiece.object!.size.y / 2,
        };

        ctx.draggedPiece.object!.pos = pos;
    }

    const tileSize = getTileSize(ctx.game.boardSize, canvas);

    // CLEAR
    painter.clearRect(0, 0, canvas.width, canvas.height);

    // DRAW BOARD
    ctx.tiles.forEach((tile) => {
        painter.fillStyle = tile.color;
        painter.globalAlpha = tile.opacity;
        painter.fillRect(
            tile.object.pos.x,
            tile.object.pos.y,
            tileSize.x,
            tileSize.y,
        );
        painter.globalAlpha = 1.0;
    });

    // DRAW PIECES
    ctx.game.pieces.forEach((piece) => {
        const o = piece.object!;

        painter.drawImage(
            getPieceImage(ctx, piece.type, piece.color),
            o.pos.x,
            o.pos.y,
            o.size.x,
            o.size.y,
        );
    });

    //draw pointer
    //painter.fillStyle = "red";
    //painter.fillRect(ctx.mousePos.x - 5, ctx.mousePos.y - 5, 10, 10);

    requestAnimationFrame((time: DOMHighResTimeStamp) => {
        render(ctx, canvas, painter, time);
    });
}

function init() {
    const canvas =
        document.querySelector<HTMLCanvasElement>("[js-id='canvas']")!;
    canvas.width = 800;
    canvas.height = 800;
    const painter: CanvasRenderingContext2D = canvas.getContext("2d")!;

    const boardSize = { x: 8, y: 8 };
    const tileSize = getTileSize(boardSize, canvas);

    // INIT PIECES
    const pieces = basicBoard;
    pieces.forEach((piece) => {
        const pos = getRealPos(piece.pos, boardSize, canvas);
        piece.object = {
            pos,
            size: tileSize,
        };
    });

    // INIT TILES
    const tiles: Tile[] = [];
    for (let x = 0; x < boardSize.x; x++) {
        for (let y = 0; y < boardSize.y; y++) {
            const color = ((x + y) & 1) == 0 ? blackTileColor : whiteTileColor;
            const opacity = 1.0;
            const boardPos = { x, y };

            const pos = getRealPos(boardPos, boardSize, canvas);
            const object: GameObject = {
                pos,
                size: tileSize,
            };

            tiles.push({
                boardPos,
                renderPos: pos,
                color,
                defaultColor: color,
                object,
                opacity,
                defaultOpacity: opacity,
            });
        }
    }

    const ctx: AppContext = {
        mouse: {
            pos: { x: 0, y: 0 },
            isMouseDown: false,
            clickOccured: false,
            releaseOccured: false,
        },
        fps: {
            lastTime: 0,
            frames: 0,
            reportInterval: 10_000,
        },
        game: {
            boardSize,
            pieces,
        },
        tiles,
        images: loadImages(),
    };

    startMouseTracking(ctx.mouse, canvas);

    requestAnimationFrame((time: DOMHighResTimeStamp) => {
        render(ctx, canvas, painter, time);
    });
}

init();
