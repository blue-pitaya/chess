export class Assets {
    public images: Record<string, HTMLImageElement> = {};

    public loadImages() {
        function mkImage(path: string): HTMLImageElement {
            const img = new Image();
            img.src = path;

            return img;
        }

        this.images = {
            "black-bishop": mkImage("black-bishop.png"),
            "black-king": mkImage("black-king.png"),
            "black-knight": mkImage("black-knight.png"),
            "black-pawn": mkImage("black-pawn.png"),
            "black-queen": mkImage("black-queen.png"),
            "black-rook": mkImage("black-rook.png"),
            "white-bishop": mkImage("white-bishop.png"),
            "white-king": mkImage("white-king.png"),
            "white-knight": mkImage("white-knight.png"),
            "white-pawn": mkImage("white-pawn.png"),
            "white-queen": mkImage("white-queen.png"),
            "white-rook": mkImage("white-rook.png"),
        };
    }

    public getPieceImage(pieceType: string, color: string) {
        return this.images[`${color}-${pieceType}`];
    }
}
