class Hex {
    constructor(q, r) {
        this.q = q;
        this.r = r;
    }

    equals(hex) {
        return this.q == hex.q && this.r == hex.r;
    }
}

Hex.add = (hex1, hex2) => {
    return new Hex(hex1.q + hex2.q, hex1.r + hex2.r);
}

Hex.hexToPoint = (hex, size) => {
    const canvas = document.getElementById("canvas");
    const originFieldAnchor = new Point(canvas.width / 2, canvas.height / 2);
    const x = size * Math.sqrt(3) * (hex.q + 0.5 * (hex.r&1)) + originFieldAnchor.x;
    const y = size * 3/2 * hex.r + originFieldAnchor.y;
    // console.log(hex.r + " - " + (hex.r&1));
    return new Point(x, y);
}
