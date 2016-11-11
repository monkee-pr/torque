class Cursor {
    constructor(isMovable = false, isSelectable = false) {
    }

    update() {

    }

    draw(ctx) {
        ctx.lineWidth = 3;
        ctx.rect(this.point.x, this.point.y, 3, 3);
        ctx.strokeColor = "blue";
        ctx.stroke();
    }
}
