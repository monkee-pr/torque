class Ball extends GameObject {
    constructor(hex) {
        const isMovable = true;
        super(isMovable);

        this.edgeLength = document.getElementById("canvas").width/50;

        this.hex = hex;

        this.vq = 0;
        this.vr = 0;
    }

    update() {
        // this.vq = 1;
        this.move();
    }

    draw(ctx) {
        const center = Hex.hexToPoint(this.hex, this.edgeLength);

        // draw circle shaped ball
        ctx.beginPath();
        const radius = this.edgeLength/1.5;
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
