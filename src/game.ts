import { Vec2, addVecs, areVecsEqual, scaleVec } from "./utils";

export interface GameContext {
    boardSize: Vec2;
    pieces: Piece[];
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

export function mkPiece(pos: Vec2, type: string, color: string): Piece {
    return {
        pos,
        type,
        color,
        hasMoved: false,
    };
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

    if (piece.type == "bishop") {
        const startPos = piece.pos;
        const directions: Vec2[] = [
            { x: -1, y: -1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: 1, y: 1 },
        ];

        directions.forEach((direction) => {
            let currentPos = piece.pos;
            for (;;) {
                currentPos = addVecs(currentPos, direction);

                if (!isOnBoard(currentPos)) {
                    break;
                }

                const otherPiece = pieceOn(currentPos);
                if (otherPiece) {
                    if (otherPiece.color == piece.color) {
                        break;
                    }

                    moves.push(currentPos);
                    break;
                }

                moves.push(currentPos);
            }
        });
    }

    return moves;
}
