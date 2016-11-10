class Hex {
    constructor(q, r) {
        this.q = q;
        this.r = r;
    }
}

Hex.add = (hex1, hex2) => {
    return new Hex(hex1.q + hex2.q, hex1.r + hex2.r);
}

Hex.hexToPoint = (hex, edgeLength) => {
    const canvas = document.getElementById("canvas");
    const originFieldAnchor = new Point(canvas.width / 2, canvas.height / 2);
    const x = originFieldAnchor.x + edgeLength * Math.sqrt(3) * (hex.q + (hex.r%2 ? 0.5 : 0));
    const y = originFieldAnchor.y + edgeLength * 3/2 * hex.r;
    return new Point(x, y);
}
