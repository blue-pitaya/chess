import "./style.css";
import { Fps } from "./Fps";
import { Assets } from "./Assets";
import { highlightColor, PieceUiObject, Ui } from "./Ui";
import { createBasicBoard } from "./Board";
import { Game } from "./Game";
import { Mouse } from "./Mouse";
import { Vec2 } from "./Vec2";
import { convertToBoardPos } from "./utils";

interface AppContext {
    assets: Assets;
    mouse: Mouse;
    fps: Fps;
    game: Game;
    ui: Ui;
    //
    dragSourcePos?: Vec2;
    dragPieceUiObject?: PieceUiObject;
}

function render(
    ctx: AppContext,
    canvas: HTMLCanvasElement,
    time: DOMHighResTimeStamp,
) {
    ctx.fps.handleFpsReporting(time);

    // HANDLE MOUSE EVENTS

    if (ctx.mouse.eventQueue.length > 0) {
        const mouseEvent = ctx.mouse.eventQueue.shift()!;

        if (mouseEvent.type == "ClickOccuredEvent") {
            const dst = convertToBoardPos(
                mouseEvent.pos,
                ctx.game.board.size,
                canvas,
            );
            const piece = ctx.game.board.getPieceOn(dst);
            if (piece) {
                ctx.dragSourcePos = dst;
                ctx.dragPieceUiObject = ctx.ui.pieces.find((p) =>
                    p.boardPos.equals(dst),
                );

                const possibleMoves = ctx.game.getPossibleMoves(
                    ctx.dragSourcePos,
                );
                possibleMoves.forEach((pos) => {
                    const tile = ctx.ui.tiles.find((tile) =>
                        tile.boardPos.equals(pos),
                    );
                    if (tile) {
                        tile.color = highlightColor;
                    }
                });
            }
        }

        if (mouseEvent.type == "ReleaseOccuredEvent") {
            if (ctx.dragPieceUiObject) {
                const dst = convertToBoardPos(
                    mouseEvent.pos,
                    ctx.game.board.size,
                    canvas,
                );

                ctx.game.makeMove(ctx.dragPieceUiObject.boardPos, dst);

                ctx.dragSourcePos = undefined;
                ctx.dragPieceUiObject = undefined;
            }

            ctx.ui.reload(ctx.game.board, canvas, ctx.assets);
        }
    }

    if (ctx.dragPieceUiObject) {
        ctx.dragPieceUiObject.pos = ctx.mouse.pos.add(
            ctx.dragPieceUiObject.size.scale(-0.5),
        );
    }

    ctx.ui.render(canvas);

    requestAnimationFrame((time: DOMHighResTimeStamp) => {
        render(ctx, canvas, time);
    });
}

function init() {
    const canvas =
        document.querySelector<HTMLCanvasElement>("[js-id='canvas']")!;
    canvas.width = 800;
    canvas.height = 800;

    const assets = new Assets();
    const board = createBasicBoard();
    const fps = new Fps();
    const mouse = new Mouse();
    const ui = new Ui();
    const game = new Game(board);
    const ctx: AppContext = {
        assets,
        fps,
        game,
        mouse,
        ui,
    };

    assets.loadImages();
    ui.reload(board, canvas, assets);
    mouse.startMouseTracking(canvas);

    requestAnimationFrame((time: DOMHighResTimeStamp) => {
        render(ctx, canvas, time);
    });
}

init();
