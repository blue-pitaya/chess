import { Assets } from "./Assets";
import { Game } from "./Game";
import { DomContext } from "./main";
import { getRealPos, getTileSize } from "./utils";
import { Vec2 } from "./Vec2";

const blackTileColor = "#b58863";
const whiteTileColor = "#f0d9b5";
export const highlightColor = "#623b69";

export interface TileUiObject {
    boardPos: Vec2;
    pos: Vec2;
    size: Vec2;
    color: string;
    opacity: number;
    defaultColor: string;
    defaultOpacity: number;
}

export interface PieceUiObject {
    boardPos: Vec2;
    pos: Vec2;
    size: Vec2;
    image: HTMLImageElement;
}

export class Ui {
    public tiles: TileUiObject[] = [];
    public pieces: PieceUiObject[] = [];

    public reload(game: Game, dom: DomContext, assets: Assets) {
        this.pieces = [];
        this.tiles = [];

        const tileSize = getTileSize(game.board.size, dom.canvas);

        //init tiles
        for (let x = 0; x < game.board.size.x; x++) {
            for (let y = 0; y < game.board.size.y; y++) {
                const color =
                    ((x + y) & 1) == 0 ? blackTileColor : whiteTileColor;
                const opacity = 1.0;
                const boardPos = new Vec2(x, y);
                const pos = getRealPos(boardPos, game.board.size, dom.canvas);

                this.tiles.push({
                    boardPos,
                    pos,
                    size: tileSize,
                    color,
                    opacity,
                    defaultColor: color,
                    defaultOpacity: opacity,
                });
            }
        }

        // init pieces
        game.board.getPiecesWithPos().forEach(({ pos, piece }) => {
            const renderPos = getRealPos(pos, game.board.size, dom.canvas);

            this.pieces.push({
                boardPos: pos.copy(),
                pos: renderPos,
                size: tileSize,
                image: assets.getPieceImage(piece.type, piece.color),
            });
        });

        //set turn
        dom.turnSpan.innerHTML = game.turnFor;
    }

    public render(canvas: HTMLCanvasElement) {
        const painter: CanvasRenderingContext2D = canvas.getContext("2d")!;

        // CLEAR
        painter.clearRect(0, 0, canvas.width, canvas.height);

        // DRAW BOARD
        this.tiles.forEach((tile) => {
            painter.fillStyle = tile.color;
            painter.globalAlpha = tile.opacity;
            painter.fillRect(tile.pos.x, tile.pos.y, tile.size.x, tile.size.y);
            painter.globalAlpha = 1.0;
        });

        // DRAW PIECES
        this.pieces.forEach((piece) => {
            painter.drawImage(
                piece.image,
                piece.pos.x,
                piece.pos.y,
                piece.size.x,
                piece.size.y,
            );
        });
    }
}
