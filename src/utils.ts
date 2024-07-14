import { Vec2 } from "./Vec2";

export function getTileSize(boardSize: Vec2, canvas: HTMLCanvasElement): Vec2 {
    return new Vec2(canvas.width / boardSize.x, canvas.height / boardSize.y);
}

export function getRealPos(
    boardPos: Vec2,
    boardSize: Vec2,
    canvas: HTMLCanvasElement,
): Vec2 {
    const tileSize = getTileSize(boardSize, canvas);

    return new Vec2(
        boardPos.x * tileSize.x,
        canvas.height - tileSize.y * (boardPos.y + 1),
    );
}

export function convertToBoardPos(
    renderPos: Vec2,
    boardSize: Vec2,
    canvas: HTMLCanvasElement,
): Vec2 {
    const tileSize = getTileSize(boardSize, canvas);

    return new Vec2(
        Math.floor(renderPos.x / tileSize.x),
        boardSize.y - 1 - Math.floor(renderPos.y / tileSize.y),
    );
}
