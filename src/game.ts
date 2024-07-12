import { Vec2, areVecsEqual } from "./utils";

export interface GameContext {
    boardSize: Vec2;
    pieces: Piece[];
    tiles: Tile[];
}

export interface Tile {
    boardPos: Vec2;
    renderPos: Vec2;
    color: string;
    opacity: number;
    object: GameObject;
    defaultColor: string;
    defaultOpacity: number;
}

export interface Piece {
    pos: Vec2;
    type: string;
    color: string;
    hasMoved: boolean;
    object?: GameObject;
}

export interface GameObject {
    pos: Vec2;
    size: Vec2;
}

export function getPossibleMoves(piece: Piece, ctx: GameContext): Vec2[] {
    let moves: Vec2[] = [];

    function pieceOn(pos: Vec2): Piece | undefined {
        return ctx.pieces.find((piece) => areVecsEqual(piece.pos, pos));
    }

    function isOnBoard(pos: Vec2): boolean {
        return (
            pos.x >= 0 &&
            pos.x < ctx.boardSize.x &&
            pos.y >= 0 &&
            pos.y < ctx.boardSize.y
        );
    }

    if (piece.type == "pawn") {
        const yMoveValue = piece.color == "white" ? 1 : -1;

        let p = { x: piece.pos.x, y: piece.pos.y + yMoveValue };
        if (!pieceOn(p) && isOnBoard(p)) {
            moves.push(p);

            p = { x: piece.pos.x, y: piece.pos.y + 2 * yMoveValue };
            if (!piece.hasMoved && !pieceOn(p) && isOnBoard(p)) {
                moves.push(p);
            }
        }
    }

    if (piece.type == "knight") {
        const moveVecs = [
            { x: -1, y: -2 },
            { x: 1, y: -2 },
            { x: -1, y: 2 },
            { x: 1, y: 2 },
            { x: -2, y: -1 },
            { x: 2, y: -1 },
            { x: -2, y: 1 },
            { x: 2, y: 1 },
        ];
        moveVecs.forEach((moveVec) => {
            const p = {
                x: piece.pos.x + moveVec.x,
                y: piece.pos.y + moveVec.y,
            };
            if (!isOnBoard(p)) {
                return;
            }

            const otherPiece = pieceOn(p);
            if (otherPiece && otherPiece.color == piece.color) {
                return;
            }

            moves.push(p);
        });
    }

    return moves;
}
