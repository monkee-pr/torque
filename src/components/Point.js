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
}

Point.pointToHex = (point, size) => {
    const canvas = document.getElementById("canvas");
    const originFieldAnchor = new Point(canvas.width / 2, canvas.height / 2);
    const relativePoint = new Point(point.x - originFieldAnchor.x, point.y - originFieldAnchor.y);
    const r = Math.round(relativePoint.y * 2/3 / size);
    const q = Math.round(relativePoint.x / (size * Math.sqrt(3)) - (r%2 ? 0.5 : 0));

    const guessedHex = new Hex(q, r);

    // correct hex
    const guessedAndNeighbors = [guessedHex].concat(Hex.getNeighbors(guessedHex));
    const points = guessedAndNeighbors.map(h => Hex.hexToPoint(h, size));
    const distancesToPoints = points.map(p => point.distanceTo(p));
    const highestDistance = distancesToPoints.reduce((a, b) => Math.min(a, b));
    const index = distancesToPoints.indexOf(highestDistance);
    const nearestHex = guessedAndNeighbors[index];

    return nearestHex;
}
