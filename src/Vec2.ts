export class Vec2 {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public equals(v: Vec2): boolean {
        return this.x == v.x && this.y == v.y;
    }

    public add(v: Vec2): Vec2 {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    public scale(n: number): Vec2 {
        return new Vec2(this.x * n, this.y * n);
    }

    public copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }
}
