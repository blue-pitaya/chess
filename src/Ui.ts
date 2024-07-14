import { Assets } from "./Assets";
import { Board } from "./Board";
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

    public reload(board: Board, canvas: HTMLCanvasElement, assets: Assets) {
        this.pieces = [];
        this.tiles = [];

        const tileSize = getTileSize(board.size, canvas);

        //init tiles
        for (let x = 0; x < board.size.x; x++) {
            for (let y = 0; y < board.size.y; y++) {
                const color =
                    ((x + y) & 1) == 0 ? blackTileColor : whiteTileColor;
                const opacity = 1.0;
                const boardPos = new Vec2(x, y);
                const pos = getRealPos(boardPos, board.size, canvas);

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
        board.getPiecesWithPos().forEach(({ pos, piece }) => {
            const renderPos = getRealPos(pos, board.size, canvas);

            this.pieces.push({
                boardPos: pos.copy(),
                pos: renderPos,
                size: tileSize,
                image: assets.getPieceImage(piece.type, piece.color),
            });
        });
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
