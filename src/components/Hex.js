class Hex {
    constructor(q, r) {
        this.q = q;
        this.r = r;
    }

    equals(hex) {
        return this.q == hex.q && this.r == hex.r;
    }

    rangeTo(hex) {
        return 0;
    }
}

Hex.add = (hex1, hex2) => {
    return new Hex(hex1.q + hex2.q, hex1.r + hex2.r);
}

Hex.hexToPoint = (anchor, hex) => {
    const size = GameObject.BASE_SIZE * Camera.scale;
    const baseX = size * Math.sqrt(3) * (hex.q + 0.5 * (hex.r&1));
    const baseY = size * 3/2 * hex.r;

    const x = baseX + anchor.x;
    const y = baseY + anchor.y;

    return new Point(x, y);
}

Hex.getNeighborAt = (hex, direction) => {
    const x = hex.r % 2;
    const evenRow = hex.r % 2 == 0;

    let neighborHex = null;
    switch (direction) {
        case Hex.DIRECTION_TOP_RIGHT:
            neighborHex = new Hex(hex.q + (hex.r&1), hex.r - 1);
            break;
        case Hex.DIRECTION_RIGHT:
            neighborHex = new Hex(hex.q + 1, hex.r);
            break;
        case Hex.DIRECTION_BOTTOM_RIGHT:
            neighborHex = new Hex(hex.q + (hex.r&1), hex.r + 1);
            break;
        case Hex.DIRECTION_BOTTOM_LEFT:
            neighborHex = new Hex(hex.q - (!(hex.r&1)), hex.r + 1);
            break;
        case Hex.DIRECTION_LEFT:
            neighborHex = new Hex(hex.q - 1, hex.r);
            break;
        case Hex.DIRECTION_TOP_LEFT:
            neighborHex = new Hex(hex.q - (!(hex.r&1)), hex.r - 1);
            break;
        default:
            console.error("Invalid direction");
    }

    return neighborHex;
}

Hex.getNeighbors = (hex) => {
    const directions = [
        Hex.DIRECTION_TOP_RIGHT,
        Hex.DIRECTION_RIGHT,
        Hex.DIRECTION_BOTTOM_RIGHT,
        Hex.DIRECTION_BOTTOM_LEFT,
        Hex.DIRECTION_LEFT,
        Hex.DIRECTION_TOP_LEFT,
    ];

    const neighbors = directions.map(d => Hex.getNeighborAt(hex, d)).filter(n => n != null);

    return neighbors;
}

Hex.DIRECTION_TOP_RIGHT = "top-right";
Hex.DIRECTION_RIGHT = "right";
Hex.DIRECTION_BOTTOM_RIGHT = "bottom-right";
Hex.DIRECTION_BOTTOM_LEFT = "bottom-left";
Hex.DIRECTION_LEFT = "left";
Hex.DIRECTION_TOP_LEFT = "top-left";
