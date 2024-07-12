import { expect, test } from "vitest";
import { GameContext, getPossibleMoves, mkPiece } from "./game";
import { black, white } from "./data";

test("knight moves", () => {
    const piece = mkPiece({ x: 1, y: 1 }, "knight", white);

    //R...
    //...b
    //.n..
    //....
    const ctx: GameContext = {
        boardSize: { x: 8, y: 8 },
        pieces: [
            piece,
            mkPiece({ x: 0, y: 3 }, "rook", black),
            mkPiece({ x: 3, y: 2 }, "bishop", white),
        ],
    };

    expect(getPossibleMoves(piece, ctx)).toStrictEqual([
        { x: 0, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 0 },
    ]);
});

test("bishop moves", () => {
    const piece = mkPiece({ x: 2, y: 1 }, "bishop", white);

    //r...R
    //.....
    //..b..
    //.....
    const ctx: GameContext = {
        boardSize: { x: 8, y: 8 },
        pieces: [
            piece,
            mkPiece({ x: 4, y: 3 }, "rook", black),
            mkPiece({ x: 0, y: 3 }, "rook", white),
        ],
    };

    expect(getPossibleMoves(piece, ctx)).toStrictEqual([
        { x: 1, y: 0 },
        { x: 3, y: 0 },
        { x: 1, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 3 },
    ]);
});
