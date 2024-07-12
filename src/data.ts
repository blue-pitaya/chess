import { Piece } from "./game";
import { Vec2 } from "./utils";

export const blackTileColor = "#b58863";
export const whiteTileColor = "#f0d9b5";
export const highlightColor = "#623b69";

const white = "white";
const black = "black";

function mkPiece(pos: Vec2, type: string, color: string): Piece {
    return {
        pos,
        type,
        color,
        hasMoved: false,
    };
}

export const basicBoard: Piece[] = [
    mkPiece({ x: 0, y: 0 }, "rook", white),
    mkPiece({ x: 1, y: 0 }, "knight", white),
    mkPiece({ x: 2, y: 0 }, "bishop", white),
    mkPiece({ x: 3, y: 0 }, "queen", white),
    mkPiece({ x: 4, y: 0 }, "king", white),
    mkPiece({ x: 5, y: 0 }, "bishop", white),
    mkPiece({ x: 6, y: 0 }, "knight", white),
    mkPiece({ x: 7, y: 0 }, "rook", white),
    mkPiece({ x: 0, y: 1 }, "pawn", white),
    mkPiece({ x: 1, y: 1 }, "pawn", white),
    mkPiece({ x: 2, y: 1 }, "pawn", white),
    mkPiece({ x: 3, y: 1 }, "pawn", white),
    mkPiece({ x: 4, y: 1 }, "pawn", white),
    mkPiece({ x: 5, y: 1 }, "pawn", white),
    mkPiece({ x: 6, y: 1 }, "pawn", white),
    mkPiece({ x: 7, y: 1 }, "pawn", white),

    mkPiece({ x: 0, y: 7 }, "rook", black),
    mkPiece({ x: 1, y: 7 }, "knight", black),
    mkPiece({ x: 2, y: 7 }, "bishop", black),
    mkPiece({ x: 3, y: 7 }, "queen", black),
    mkPiece({ x: 4, y: 7 }, "king", black),
    mkPiece({ x: 5, y: 7 }, "bishop", black),
    mkPiece({ x: 6, y: 7 }, "knight", black),
    mkPiece({ x: 7, y: 7 }, "rook", black),
    mkPiece({ x: 0, y: 6 }, "pawn", black),
    mkPiece({ x: 1, y: 6 }, "pawn", black),
    mkPiece({ x: 2, y: 6 }, "pawn", black),
    mkPiece({ x: 3, y: 6 }, "pawn", black),
    mkPiece({ x: 4, y: 6 }, "pawn", black),
    mkPiece({ x: 5, y: 6 }, "pawn", black),
    mkPiece({ x: 6, y: 6 }, "pawn", black),
    mkPiece({ x: 7, y: 6 }, "pawn", black),
];
