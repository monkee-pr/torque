class Ball extends GameObject {
    constructor(hex) {
        const isMovable = true;
        super(isMovable);

        this.edgeLength = GameObject;

        this.hex = hex;

        this.vq = 0;
        this.vr = 0;
    }

    update() {
        super.update();
        this.move();
    }

    draw(ctx) {
        const size = GameObject.BASE_SIZE * this.scale;
        const center = Hex.hexToPoint(this.hex, size);

        // draw circle shaped ball
        ctx.beginPath();
        const radius = size/1.75;
        ctx.arc(center.x, center.y, radius, 0, 2*Math.PI, false);
        ctx.fillStyle = Color.BALL;
        ctx.fill();
    }

    move() {
        // set new position
        const vector = new Hex(this.vq, this.vr);
        this.hex = Hex.add(this.hex, vector);

        // reset movement
        this.vq = 0;
        this.vr = 0;
    }
}
