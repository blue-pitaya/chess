import { Board } from "./Board";
import { Vec2 } from "./Vec2";

export type Color = "white" | "black";

export interface Piece {
    type: string;
    color: Color;
    hasMoved: boolean;
}

export function mkPiece(type: string, color: Color): Piece {
    return {
        type,
        color,
        hasMoved: false,
    };
}

export class Game {
    public turnFor: Color = "white";
    public board: Board;

    public constructor(board: Board) {
        this.board = board;
    }

    public getPossibleMoves(pos: Vec2): Vec2[] {
        let moves: Vec2[] = [];

        const piece = this.board.getPieceOn(pos);
        if (!piece) {
            return [];
        }

        if (piece.type == "pawn") {
            moves = this.getPawnMoves(pos, piece);
        }

        if (piece.type == "knight") {
            moves = this.getKnightMoves(pos, piece);
        }

        if (piece.type == "bishop") {
            moves = this.getBishopMoves(pos, piece);
        }

        if (piece.type == "rook") {
            moves = this.getRookMoves(pos, piece);
        }

        if (piece.type == "queen") {
            moves = this.getQueenMoves(pos, piece);
        }

        if (piece.type == "king") {
            moves = this.getKingMoves(pos, piece);
        }

        return moves;
    }

    public makeMove(from: Vec2, to: Vec2) {
        const piece = this.board.getPieceOn(from);
        if (!piece) {
            return;
        }

        const possibleMoves = this.getPossibleMoves(from);
        if (possibleMoves.find((v) => v.equals(to))) {
            piece.hasMoved = true;
        }
    }

    private getKingMoves(pos: Vec2, piece: Piece): Vec2[] {
        const res: Vec2[] = [];

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x == 0 && y == 0) {
                    continue;
                }

                const currentPos = pos.add(new Vec2(x, y));

                if (!this.board.isOnBoard(currentPos)) {
                    continue;
                }

                const otherPiece = this.board.getPieceOn(currentPos);
                if (otherPiece && otherPiece.color == piece.color) {
                    continue;
                }

                res.push(currentPos);
            }
        }

        return res;
    }

    private getQueenMoves(pos: Vec2, piece: Piece): Vec2[] {
        return this.getRookMoves(pos, piece).concat(
            this.getBishopMoves(pos, piece),
        );
    }

    private getPawnMoves(pos: Vec2, piece: Piece): Vec2[] {
        const moves: Vec2[] = [];
        const yMoveValue = piece.color == "white" ? 1 : -1;

        let p = new Vec2(pos.x, pos.y + yMoveValue);
        if (!this.board.getPieceOn(p) && this.board.isOnBoard(p)) {
            moves.push(p);

            p = new Vec2(pos.x, pos.y + 2 * yMoveValue);
            if (
                !piece.hasMoved &&
                !this.board.getPieceOn(p) &&
                this.board.isOnBoard(p)
            ) {
                moves.push(p);
            }
        }

        return moves;
    }

    private getKnightMoves(pos: Vec2, piece: Piece): Vec2[] {
        const moves: Vec2[] = [];
        const moveVecs = [
            new Vec2(-1, -2),
            new Vec2(1, -2),
            new Vec2(-1, 2),
            new Vec2(1, 2),
            new Vec2(-2, -1),
            new Vec2(2, -1),
            new Vec2(-2, 1),
            new Vec2(2, 1),
        ];
        moveVecs.forEach((moveVec) => {
            const p = pos.add(moveVec);
            if (!this.board.isOnBoard(p)) {
                return;
            }

            const otherPiece = this.board.getPieceOn(p);
            if (otherPiece && otherPiece.color == piece.color) {
                return;
            }

            moves.push(p);
        });

        return moves;
    }

    private getRookMoves(pos: Vec2, piece: Piece): Vec2[] {
        const moves: Vec2[] = [];
        const directions: Vec2[] = [
            new Vec2(-1, 0),
            new Vec2(1, 0),
            new Vec2(0, -1),
            new Vec2(0, 1),
        ];

        directions.forEach((direction) => {
            let currentPos = pos;
            for (;;) {
                currentPos = currentPos.add(direction);

                if (!this.board.isOnBoard(currentPos)) {
                    break;
                }

                const otherPiece = this.board.getPieceOn(currentPos);
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

        return moves;
    }

    private getBishopMoves(pos: Vec2, piece: Piece): Vec2[] {
        const moves: Vec2[] = [];
        const directions: Vec2[] = [
            new Vec2(-1, -1),
            new Vec2(1, -1),
            new Vec2(-1, 1),
            new Vec2(1, 1),
        ];

        directions.forEach((direction) => {
            let currentPos = pos;
            for (;;) {
                currentPos = currentPos.add(direction);

                if (!this.board.isOnBoard(currentPos)) {
                    break;
                }

                const otherPiece = this.board.getPieceOn(currentPos);
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

        return moves;
    }
}