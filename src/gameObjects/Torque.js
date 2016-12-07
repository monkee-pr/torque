class Torque extends GameObject {
    constructor(gp, hex) {
        super();

        this.gp = gp;
        this.hex = hex;

        this.vq = 0;
        this.vr = 0;

        this.color = Color.TORQUE;
        this.image = resources.torque;
    }

    update() {
        super.update();
        this.move();
    }

    draw(ctx) {
        const gp = this.gp;
        const cameraMode = gp.camera.getMode();
        const cameraPosition = gp.camera.position;
        const scaledSize = GameObject.BASE_SIZE * Camera.scale;

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

        const drawBorder = () => {
            // draw border
            if (this.isHighlighted) {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 5;
                ctx.strokeStyle = Color.BORDER_HIGHLIGHT;
            } else if (this.isHovered) {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
                ctx.strokeStyle = Color.BORDER_HOVER;
            } else {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale;
                ctx.strokeStyle = Color.FIELD_BORDER_REGULAR;
            }
            ctx.stroke();
        }

        if (cameraMode == Camera.MODE_TOP_DOWN) {
            // fill area
            if (this.color) {
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            if (this.type == Field.TYPE_HOT_ZONE || this.type == Field.TYPE_SUPER_HOT_ZONE) {
                // draw inner circles
                ctx.beginPath();
                const lineWidth = Field.BORDER_WIDTH * Camera.scale;
                const radius = scaledSize/1.5;
                ctx.arc(center.x, center.y, lineWidth, 0, 2*Math.PI, false);
                ctx.strokeStyle = Color.FIELD_HOLE_CIRCLES;
                const amountOfCircles = 2;
                for (var i = 0; i < amountOfCircles; i++) {
                    ctx.lineWidth = radius * (i+1);
                    ctx.stroke();
                }
            }
            drawBorder();
        } else if (cameraMode == Camera.MODE_ISOMETRIC) {
            if (this.image != null) {
                const point = center.toIso(cameraPosition);
                // const point = new Point(point1.x-4, point1.y-4);
                const width = this.image.width * Camera.scale;
                const height = this.image.height * Camera.scale;
                ctx.drawImage(this.image, point.x - width/2, point.y - height/2, width, height);
            }
            // drawBorder();
        }
    }

    onClick() {
    }

    move() {
        // set new position
        const vector = new Hex(this.vq, this.vr);
        this.hex = Hex.add(this.hex, vector);

        // reset movement
        this.vq = 0;
        this.vr = 0;
    }

    getField() {
        const fields = this.gp.layers.getBoardFields();
        const thisField = fields.filter(f => f.hex.equals(this.hex))[0];

        return thisField;
    }

    scatter() {
        const amountOfFieldsScattering = Math.randomInt(1, 6);
        const direction = Array.getRandomElement(Hex.ALL_DIRECTIONS);
        for (var i = 0; i < amountOfFieldsScattering; i++) {
            const field = this.getField();
            let neighborField = field.getNeighborAt(direction);
            if (neighborField == null) {
                neighborField = field.getNeighborAt(Hex.mirrorDirection(direction));
            }

            if (!neighborField.isAccessible()) {
                // neighbor field is not accessible

                if (neighborField.type == Field.TYPE_PIT) {
                    this.gp.respawnTorque();
                    return;
                } else if (neighborField.type == Field.TYPE_HOLE) {
                    this.scatter();
                    return;
                }
            } else {
                this.hex = new Hex(neighborField.hex.q, neighborField.hex.r);

                const playerOfNeighbor = neighborField.getGameObjects().filter(go => go instanceof Player)[0];
                if (playerOfNeighbor != null) {
                    playerOfNeighbor.pickUpTorque();
                    return;
                }
            }
        }
    }
}
