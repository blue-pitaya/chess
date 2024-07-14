import { expect, test } from "vitest";
import { Game, mkPiece } from "./Game";
import { Board } from "./Board";
import { Vec2 } from "./Vec2";

test("knight moves", () => {
    const pos = new Vec2(1, 1);

    //R...
    //...b
    //.n..
    //....
    const game = new Game(
        new Board(new Vec2(8, 8), [
            { pos: pos.copy(), piece: mkPiece("knight", "white") },
            { pos: new Vec2(0, 3), piece: mkPiece("rook", "black") },
            { pos: new Vec2(3, 2), piece: mkPiece("bishop", "white") },
        ]),
    );

    expect(game.getPossibleMoves(pos)).toStrictEqual([
        new Vec2(0, 3),
        new Vec2(2, 3),
        new Vec2(3, 0),
    ]);
});

test("bishop moves", () => {
    const pos = new Vec2(2, 1);

    //r...R
    //.....
    //..b..
    //.....
    const game = new Game(
        new Board(new Vec2(8, 8), [
            { pos: pos.copy(), piece: mkPiece("bishop", "white") },
            { pos: new Vec2(4, 3), piece: mkPiece("rook", "black") },
            { pos: new Vec2(0, 3), piece: mkPiece("rook", "white") },
        ]),
    );

    expect(game.getPossibleMoves(pos)).toStrictEqual([
        new Vec2(1, 0),
        new Vec2(3, 0),
        new Vec2(1, 2),
        new Vec2(3, 2),
        new Vec2(4, 3),
    ]);
});
