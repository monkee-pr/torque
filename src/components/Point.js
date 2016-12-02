class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distanceTo(point) {
        const vx = Math.abs(this.x - point.x);
        const vy = Math.abs(this.y - point.y);

        const distance = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));

        return distance;
    }

    hits(point, width, height) {
        return !(
            this.x < point.x ||
            this.x > point.x + width ||
            this.y < point.y ||
            this.y > point.y + height
        )
    }

    toIso(anchor) {
        const relativeX = this.x - anchor.x;
        const relativeY = this.y - anchor.y;

        const radians = -Camera.ROTATE_Z * (Math.PI/180);
        const rotatedX = relativeX * Math.cos(radians) - relativeY * Math.sin(radians);
        const rotatedY = relativeX * Math.sin(radians) + relativeY * Math.cos(radians);

        const scaledX = rotatedX;
        const scaledY = rotatedY * Camera.SCALE_Y;

        return new Point(scaledX + anchor.x, scaledY + anchor.y);
    }

    toRegular(anchor) {
        const relativeX = this.x - anchor.x;
        const relativeY = this.y - anchor.y;

        const scaledX = relativeX;
        const scaledY = relativeY / Camera.SCALE_Y;

        const radians = Camera.ROTATE_Z * (Math.PI/180);
        const rotatedX = scaledX * Math.cos(radians) - scaledY * Math.sin(radians);
        const rotatedY = scaledX * Math.sin(radians) + scaledY * Math.cos(radians);

        return new Point(rotatedX + anchor.x, rotatedY + anchor.y);
    }
}

Point.pointToHex = (anchor, point) => {
    const size = GameObject.BASE_SIZE * Camera.scale;

    const baseX = point.x;
    const baseY = point.y;

    const relativePoint = new Point(baseX - anchor.x, baseY - anchor.y);

    const r = Math.round(relativePoint.y * 2/3 / size);
    const q = Math.round(relativePoint.x / (size * Math.sqrt(3)) - r/2);

    const guessedHex = new Hex(q, r);

    // correct hex
    const guessedAndNeighbors = [guessedHex].concat(Hex.getNeighbors(guessedHex));
    const points = guessedAndNeighbors.map(h => Hex.hexToPoint(anchor, h));
    const distancesToPoints = points.map(p => point.distanceTo(p));
    const highestDistance = distancesToPoints.reduce((a, b) => Math.min(a, b));
    const index = distancesToPoints.indexOf(highestDistance);
    const nearestHex = guessedAndNeighbors[index];

    return nearestHex;
}
