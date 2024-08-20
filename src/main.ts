import "./style.css";
import { Fps } from "./Fps";
import { Assets } from "./Assets";
import { highlightColor, PieceUiObject, Ui } from "./Ui";
import { createBasicBoard } from "./Board";
import { Game } from "./Game";
import { Mouse } from "./Mouse";
import { convertToBoardPos } from "./utils";

interface AppContext {
    assets: Assets;
    mouse: Mouse;
    fps: Fps;
    game: Game;
    ui: Ui;
    //
    dragPieceUiObject?: PieceUiObject;
}

function render(ctx: AppContext, dom: DomContext, time: DOMHighResTimeStamp) {
    ctx.fps.handleFpsReporting(time);

    // HANDLE MOUSE EVENTS

    if (ctx.mouse.eventQueue.length > 0) {
        const mouseEvent = ctx.mouse.eventQueue.shift()!;

        if (mouseEvent.type == "ClickOccuredEvent") {
            const boardPos = convertToBoardPos(
                mouseEvent.pos,
                ctx.game.board.size,
                dom.canvas,
            );

            if (ctx.game.board.getPieceOn(boardPos)) {
                ctx.dragPieceUiObject = ctx.ui.pieces.find((p) =>
                    p.boardPos.equals(boardPos),
                );

                ctx.game.getPossibleMoves(boardPos).forEach((pos) => {
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
                    dom.canvas,
                );

                ctx.game.makeMove(ctx.dragPieceUiObject.boardPos, dst);

                ctx.dragPieceUiObject = undefined;
            }

            ctx.ui.reload(ctx.game, dom, ctx.assets);
        }
    }

    if (ctx.dragPieceUiObject) {
        ctx.dragPieceUiObject.pos = ctx.mouse.pos.add(
            ctx.dragPieceUiObject.size.scale(-0.5),
        );
    }

    ctx.ui.render(dom.canvas);

    requestAnimationFrame((time: DOMHighResTimeStamp) => {
        render(ctx, dom, time);
    });
}

export interface DomContext {
    canvas: HTMLCanvasElement;
    turnSpan: HTMLSpanElement;
}

function init() {
    const dom: DomContext = {
        canvas: document.querySelector<HTMLCanvasElement>("[js-id='canvas']")!,
        turnSpan: document.querySelector<HTMLSpanElement>("[js-id='turn']")!,
    };

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

    dom.canvas.width = 800;
    dom.canvas.height = 800;

    assets.loadImages();
    ui.reload(game, dom, assets);
    mouse.startMouseTracking(dom.canvas);

    requestAnimationFrame((time: DOMHighResTimeStamp) => {
        render(ctx, dom, time);
    });
}

init();
