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

    toIso() {
        const canvas = document.getElementById("canvas");
        const originFieldAnchor = new Point(canvas.width / 2, canvas.height / 2);

        const relativeX = this.x - originFieldAnchor.x;
        const relativeY = this.y - originFieldAnchor.y;

        const radians = -Camera.ROTATE_Z * (Math.PI/180);
        const rotatedX = relativeX * Math.cos(radians) - relativeY * Math.sin(radians);
        const rotatedY = relativeX * Math.sin(radians) + relativeY * Math.cos(radians);

        const scaledX = rotatedX;
        const scaledY = rotatedY * Camera.SCALE_Y;

        return new Point(scaledX + originFieldAnchor.x, scaledY + originFieldAnchor.y);
    }

    // toRegular(point) {
    //     const canvas = document.getElementById("canvas");
    //     const originFieldAnchor = new Point(canvas.width / 2, canvas.height / 2);
    //
    //     const radians = Camera.ROTATE_Z * (Math.PI/180);
    //     const rotatedX = this.x * Math.cos(radians) - this.y * Math.sin(radians);
    //     const rotatedY = this.x * Math.sin(radians) + this.y * Math.cos(radians);
    //
    //     const scaledX = rotatedX;
    //     const scaledY = rotatedY / Camera.SCALE_Y;
    //
    //     return new Point(rotatedX, rotatedY);
    // }
}

Point.pointToHex = (point, size, iso = false) => {
    const canvas = document.getElementById("canvas");
    const originFieldAnchor = new Point(canvas.width / 2, canvas.height / 2);

    const baseX = point.x;
    const baseY = point.y;

    let relativePoint = null;
    if (iso) {
        const scaledX = baseX;
        const scaledY = baseY * Camera.SCALE_Y;

        const radians = -Camera.ROTATE_Z * (Math.PI/180);
        const rotatedX = scaledX * Math.cos(radians) - scaledY * Math.sin(radians);
        const rotatedY = scaledX * Math.sin(radians) + scaledY * Math.cos(radians);

        const x = rotatedX + originFieldAnchor.x;
        const y = rotatedY + originFieldAnchor.y;

        relativePoint = new Point(x, y);
    } else {
        relativePoint = new Point(baseX - originFieldAnchor.x, baseY - originFieldAnchor.y);
    }

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
