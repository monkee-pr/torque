class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
Point.pointToHex = (point, size) => {
    const canvas = document.getElementById("canvas");
    const originFieldAnchor = new Point(canvas.clientWidth / 2, canvas.clientHeight / 2);
    const r = Math.round((point.y - originFieldAnchor.y) / size);
    const q = Math.round((point.x - originFieldAnchor.x) / (size) - (r%2 == 0 ? 0 : 0.5));
    // debugger;
    return new Hex(q, r);
}
