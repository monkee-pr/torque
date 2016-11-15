class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
// Point.pointToHex = (point, size) => {
//     const canvas = document.getElementById("canvas");
//     const originFieldAnchor = new Point(canvas.clientWidth / 2, canvas.clientHeight / 2);
//     console.log(new Point((point.x - originFieldAnchor.x), (point.y - originFieldAnchor.y)));
//     const r = Math.round((point.y - originFieldAnchor.y) / size);
//     const q = Math.round((point.x - originFieldAnchor.x) / (size) - (r%2 == 0 ? 0 : 0.5));
//     const r1 = Math.round((point.y - originFieldAnchor.y) / size);
//     const q1 = Math.round((point.x - originFieldAnchor.x) / (size));
//     console.log(new Hex(q, r));
//     // debugger;
//     return new Hex(q, r);
// }
Point.pointToHex = (point, size) => {
    const canvas = document.getElementById("canvas");
    const originFieldAnchor = new Point(canvas.width / 2, canvas.height / 2);
    const r = Math.round((point.y - originFieldAnchor.y) * 2/3 / size);
    const q = Math.round((point.x - originFieldAnchor.x) / (size * Math.sqrt(3)) - (r%2 ? 0.5 : 0));
    return new Hex(q, r);
}
