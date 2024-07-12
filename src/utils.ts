export interface Vec2 {
    x: number;
    y: number;
}

export function areVecsEqual(v1: Vec2, v2: Vec2): boolean {
    return v1.x == v2.x && v1.y == v2.y;
}
