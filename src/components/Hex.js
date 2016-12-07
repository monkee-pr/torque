class Hex {
    constructor(q, r) {
        this.q = q;
        this.r = r;
    }

    equals(hex) {
        return this.q == hex.q && this.r == hex.r;
    }

    distanceTo(hex) {
        const vq = Math.abs(this.q - hex.q);
        const vr = Math.abs(this.r - hex.r);
        const distance = vq + vr;

        return distance;
    }
}

Hex.add = (hex1, hex2) => {
    return new Hex(hex1.q + hex2.q, hex1.r + hex2.r);
}

Hex.hexToPoint = (anchor, hex) => {
    const size = GameObject.BASE_SIZE * Camera.scale;
    const baseX = size * Math.sqrt(3) * (hex.r/2 + hex.q);
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
        case Hex.DIRECTION_TOP_LEFT:
            neighborHex = new Hex(hex.q, hex.r - 1);
            break;
        case Hex.DIRECTION_TOP_RIGHT:
            neighborHex = new Hex(hex.q + 1, hex.r - 1);
            break;
        case Hex.DIRECTION_RIGHT:
            neighborHex = new Hex(hex.q + 1, hex.r);
            break;
        case Hex.DIRECTION_BOTTOM_RIGHT:
            neighborHex = new Hex(hex.q, hex.r + 1);
            break;
        case Hex.DIRECTION_BOTTOM_LEFT:
            neighborHex = new Hex(hex.q - 1, hex.r + 1);
            break;
        case Hex.DIRECTION_LEFT:
            neighborHex = new Hex(hex.q - 1, hex.r);
            break;
        default:
            console.error("Invalid direction");
    }

    return neighborHex;
}

Hex.getNeighbors = (hex) => {
    const directions = Hex.ALL_DIRECTIONS;

    const neighbors = directions.map(d => Hex.getNeighborAt(hex, d)).filter(n => n != null);

    return neighbors;
}

Hex.getDirectionLeftFrom = (direction) => {
    const index = Hex.ALL_DIRECTIONS.indexOf(direction);

    if (index == -1) {
        return null;
    } else {
        let newIndex = index-1;
        if (newIndex < 0) {
            newIndex = Hex.ALL_DIRECTIONS.length-1;
        }

        return Hex.ALL_DIRECTIONS[newIndex];
    }
}

Hex.getDirectionRightFrom = (direction) => {
    const index = Hex.ALL_DIRECTIONS.indexOf(direction);

    if (index == -1) {
        return null;
    } else {
        let newIndex = index+1;
        if (newIndex > Hex.ALL_DIRECTIONS.length-1) {
            newIndex = 0;
        }

        return Hex.ALL_DIRECTIONS[newIndex];
    }
}

Hex.getFrontDirectionsFrom = (direction) => {
    const directions = [];
    directions.push(Hex.getDirectionLeftFrom(direction));
    directions.push(direction);
    directions.push(Hex.getDirectionRightFrom(direction));

    return directions;
}

Hex.sortDirectionsForDraw = (directions) => {
    const wishedOrder = [
        Hex.DIRECTION_TOP_RIGHT,
        Hex.DIRECTION_RIGHT,
        Hex.DIRECTION_TOP_LEFT,
        Hex.DIRECTION_BOTTOM_RIGHT,
        Hex.DIRECTION_LEFT,
        Hex.DIRECTION_BOTTOM_LEFT,
    ];

    const orderedDirections = wishedOrder.filter(dir => directions.indexOf(dir) != -1);

    return orderedDirections;
}

Hex.DIRECTION_TOP_LEFT = "top-left";
Hex.DIRECTION_TOP_RIGHT = "top-right";
Hex.DIRECTION_RIGHT = "right";
Hex.DIRECTION_BOTTOM_RIGHT = "bottom-right";
Hex.DIRECTION_BOTTOM_LEFT = "bottom-left";
Hex.DIRECTION_LEFT = "left";

Hex.ALL_DIRECTIONS = [
    Hex.DIRECTION_TOP_LEFT,
    Hex.DIRECTION_TOP_RIGHT,
    Hex.DIRECTION_RIGHT,
    Hex.DIRECTION_BOTTOM_RIGHT,
    Hex.DIRECTION_BOTTOM_LEFT,
    Hex.DIRECTION_LEFT,
];
