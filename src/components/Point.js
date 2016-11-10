class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
Point.pointToHex = (point, edgeLength) => {
    const canvas = document.getElementById("canvas");
    const originFieldAnchor = new Point(canvas.width / 2, canvas.height / 2);
    const r = Math.round((point.y - originFieldAnchor.y) * 2/3 / edgeLength);
    const q = Math.round((point.x - originFieldAnchor.x) / (edgeLength * Math.sqrt(3)) - (r%2 ? 0.5 : 0));
    console.log(new Hex(q, r));
    return new Hex(q, r);
}
