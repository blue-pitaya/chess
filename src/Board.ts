import { Piece } from "./Game";
import { Vec2 } from "./Vec2";

export interface PieceDefinition {
    pos: Vec2;
    piece: Piece;
}

export class Board {
    public size: Vec2;
    public data: (Piece | undefined)[] = [];

    public constructor(
        size: Vec2 = new Vec2(0, 0),
        pieceDefs: PieceDefinition[] = [],
    ) {
        this.size = size;

        for (let y = 0; y < size.y; y++) {
            for (let x = 0; x < size.x; x++) {
                this.data.push(undefined);
            }
        }

        pieceDefs.forEach((def) => {
            const i = def.pos.y * size.x + def.pos.x;
            this.data[i] = def.piece;
        });
    }

    public getPieceOn(pos: Vec2): Piece | undefined {
        return this.data[pos.y * this.size.x + pos.x];
    }

    public setPieceOn(pos: Vec2, piece: Piece | undefined) {
        this.data[pos.y * this.size.x + pos.x] = piece;
    }

    public isOnBoard(pos: Vec2): boolean {
        return (
            pos.x >= 0 &&
            pos.x < this.size.x &&
            pos.y >= 0 &&
            pos.y < this.size.y
        );
    }

    public getPiecesWithPos(): { pos: Vec2; piece: Piece }[] {
        const res: { pos: Vec2; piece: Piece }[] = [];
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] == undefined) {
                continue;
            }

            const x = i % this.size.x;
            const y = Math.floor(i / this.size.x);

            res.push({
                pos: new Vec2(x, y),
                piece: this.data[i]!,
            });
        }

        return res;
    }

    public deepCopy(): Board {
        const board = new Board();
        board.size = this.size.copy();
        this.data.forEach((x) => {
            if (x !== undefined) {
                board.data.push(x.copy());
            } else {
                board.data.push(x);
            }
        });

        return board;
    }
}

export function createBasicBoard(): Board {
    return new Board(new Vec2(8, 8), [
        { pos: new Vec2(0, 0), piece: new Piece("rook", "white") },
        { pos: new Vec2(1, 0), piece: new Piece("knight", "white") },
        { pos: new Vec2(2, 0), piece: new Piece("bishop", "white") },
        { pos: new Vec2(3, 0), piece: new Piece("queen", "white") },
        { pos: new Vec2(4, 0), piece: new Piece("king", "white") },
        { pos: new Vec2(5, 0), piece: new Piece("bishop", "white") },
        { pos: new Vec2(6, 0), piece: new Piece("knight", "white") },
        { pos: new Vec2(7, 0), piece: new Piece("rook", "white") },
        { pos: new Vec2(0, 1), piece: new Piece("pawn", "white") },
        { pos: new Vec2(1, 1), piece: new Piece("pawn", "white") },
        { pos: new Vec2(2, 1), piece: new Piece("pawn", "white") },
        { pos: new Vec2(3, 1), piece: new Piece("pawn", "white") },
        { pos: new Vec2(4, 1), piece: new Piece("pawn", "white") },
        { pos: new Vec2(5, 1), piece: new Piece("pawn", "white") },
        { pos: new Vec2(6, 1), piece: new Piece("pawn", "white") },
        { pos: new Vec2(7, 1), piece: new Piece("pawn", "white") },

        { pos: new Vec2(0, 7), piece: new Piece("rook", "black") },
        { pos: new Vec2(1, 7), piece: new Piece("knight", "black") },
        { pos: new Vec2(2, 7), piece: new Piece("bishop", "black") },
        { pos: new Vec2(3, 7), piece: new Piece("queen", "black") },
        { pos: new Vec2(4, 7), piece: new Piece("king", "black") },
        { pos: new Vec2(5, 7), piece: new Piece("bishop", "black") },
        { pos: new Vec2(6, 7), piece: new Piece("knight", "black") },
        { pos: new Vec2(7, 7), piece: new Piece("rook", "black") },
        { pos: new Vec2(0, 6), piece: new Piece("pawn", "black") },
        { pos: new Vec2(1, 6), piece: new Piece("pawn", "black") },
        { pos: new Vec2(2, 6), piece: new Piece("pawn", "black") },
        { pos: new Vec2(3, 6), piece: new Piece("pawn", "black") },
        { pos: new Vec2(4, 6), piece: new Piece("pawn", "black") },
        { pos: new Vec2(5, 6), piece: new Piece("pawn", "black") },
        { pos: new Vec2(6, 6), piece: new Piece("pawn", "black") },
        { pos: new Vec2(7, 6), piece: new Piece("pawn", "black") },
    ]);
}
