class Ball extends GameObject {
    constructor(hex) {
        const isMovable = true;
        super(isMovable);

        this.edgeLength = GameObject;

        this.hex = hex;

        this.vq = 0;
        this.vr = 0;

        this.color = Color.BALL;
        this.image = resources.ball;
    }

    update() {
        super.update();
        this.move();
    }

    draw(ctx, gp) {
        const cameraMode = gp.camera.getMode();
        const cameraPosition = gp.camera.position;
        const scaledSize = GameObject.BASE_SIZE * this.scale;

        const center = Hex.hexToPoint(cameraPosition, this.hex);

        // calc corner points
        let p0 = new Point(center.x, center.y - scaledSize);                                            // top
        let p1 = new Point(center.x + Math.getTrianglesHeight(scaledSize), center.y - scaledSize/2);    // top right
        let p2 = new Point(center.x + Math.getTrianglesHeight(scaledSize), center.y + scaledSize/2);    // bottom right
        let p3 = new Point(center.x, center.y + scaledSize);                                            // bottom
        let p4 = new Point(center.x - Math.getTrianglesHeight(scaledSize), center.y + scaledSize/2);    // bottom left
        let p5 = new Point(center.x - Math.getTrianglesHeight(scaledSize), center.y - scaledSize/2);    // top left
        if (cameraMode == Camera.MODE_ISOMETRIC) {
            p0 = p0.toIso(cameraPosition);
            p1 = p1.toIso(cameraPosition);
            p2 = p2.toIso(cameraPosition);
            p3 = p3.toIso(cameraPosition);
            p4 = p4.toIso(cameraPosition);
            p5 = p5.toIso(cameraPosition);
        }

        // define border
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.closePath();

        if (cameraMode == Camera.MODE_TOP_DOWN) {
            // fill area
            if (this.color) {
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            if (this.type == Field.TYPE_HOT_ZONE || this.type == Field.TYPE_SUPER_HOT_ZONE) {
                // draw inner circles
                ctx.beginPath();
                const lineWidth = Field.BORDER_WIDTH * this.scale;
                const radius = scaledSize/1.5;
                ctx.arc(center.x, center.y, lineWidth, 0, 2*Math.PI, false);
                ctx.strokeStyle = Color.FIELD_HOLE_CIRCLES;
                const amountOfCircles = 2;
                for (var i = 0; i < amountOfCircles; i++) {
                    ctx.lineWidth = radius * (i+1);
                    ctx.stroke();
                }
            }
        } else if (cameraMode == Camera.MODE_ISOMETRIC) {
            if (this.image != null) {
                const point = Hex.hexToPoint(cameraPosition, this.hex).toIso(cameraPosition);
                const width = this.image.width * this.scale;
                const height = this.image.height * this.scale;
                ctx.drawImage(this.image, point.x - width/2, point.y - height/2, width, height);
            }
        }

        // draw border
        if (this.isHighlighted) {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 5;
            ctx.strokeStyle = Color.BORDER_HIGHLIGHT;
        } else if (this.isHovered) {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 2;
            ctx.strokeStyle = Color.BORDER_HOVER;
        } else {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale;
            ctx.strokeStyle = Color.FIELD_BORDER_REGULAR;
        }
        ctx.stroke();
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
