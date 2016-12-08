class ParticipatingObject extends GameObject {
    constructor(gp, hex) {
        super(gp);

        this.hex = hex;
        this.imageAnchor = null;
        this.image = null;

        // this.standingAnimation = new Animation(sprites, 1000, Animation.TYPE_LOOP);
        this.moveStartTime = null;
        this.moveDuration = 1000;   // ms
        this.endHex = null;

        // this.movingAnimation =
    }

    update(now) {
        super.update();

        const cameraPosition = this.gp.camera.position;
        if (this.image != null) {
            let point = Hex.hexToPoint(cameraPosition, this.hex).toIso(cameraPosition);
            if (this.moveStartTime != null) {
                const startPoint = point;
                const endPoint = Hex.hexToPoint(cameraPosition, this.endHex).toIso(cameraPosition);

                const dx = startPoint.x - endPoint.x;
                const dy = startPoint.y - endPoint.y;

                const runningTime = now - this.moveStartTime;

                const x = startPoint.x + (dx / this.moveDuration * runningTime);
                const y = startPoint.y + (dy / this.moveDuration * runningTime);
                point = new Point(x, y);
            }

            const image = this.image;
            const width = image.width * Camera.scale;
            const height = image.height * Camera.scale;
            this.imageAnchor = new Point(point.x - width/2, point.y - (height - 150*Camera.scale));
        }
    }

    draw(ctx) {
        super.draw(ctx)
    }

    onClick() {
        // console.log(this);
    }

    move(hex) {
        this.moveStartTime = Date.now();
        this.endHex = hex;
    }
}
