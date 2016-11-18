class Field extends GameObject {
    constructor(board, hex, type = Field.TYPE_REGULAR) {
        super();

        this.board = board;
        this.hex = hex;
        this.type = type;

        if (hex.q < 0) {
            this.teamSide = Team.TEAM_1;
        } else {
            this.teamSide = Team.TEAM_2;
        }

        // color for top down perspective
        let fill = true;
        switch (this.type) {
            case Field.TYPE_REGULAR:
                break;
            case Field.TYPE_HOLE:
                this.color = Color.FIELD_HOLE_BACKGROUND;
                break;
            case Field.TYPE_HOT_ZONE:
                break;
            case Field.TYPE_SUPER_HOT_ZONE:
                this.color = Color.FIELD_SUPER_HOT_ZONE_BACKGROUND;
                break;
            case Field.TYPE_PIT:
                this.color = Color.FIELD_PIT_BACKGROUND;
                break;
            case Field.TYPE_MIDFIELD:
                this.color = Color.FIELD_MIDFIELD_BACKGROUND;
                break;
        }

        // image for iso perspective
        switch (this.type) {
            case Field.TYPE_REGULAR:
                break;
            case Field.TYPE_HOLE:
            {
                switch (this.teamSide) {
                    case Team.TEAM_1:
                        this.image = resources.tileGoalBlue;
                        break;
                    case Team.TEAM_2:
                        this.image = resources.tileGoalRed;
                        break;
                }
                break;
            }
            case Field.TYPE_HOT_ZONE:
                break;
            case Field.TYPE_SUPER_HOT_ZONE:
                break;
            case Field.TYPE_PIT:
                break;
            case Field.TYPE_MIDFIELD:
            {
                this.image = resources.tileMidfield;
                break;
            }
        }
    }

    update() {
        super.update();
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
            p0 = p0.toIso(gp.camera.position);
            p1 = p1.toIso(gp.camera.position);
            p2 = p2.toIso(gp.camera.position);
            p3 = p3.toIso(gp.camera.position);
            p4 = p4.toIso(gp.camera.position);
            p5 = p5.toIso(gp.camera.position);
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
                const point = Hex.hexToPoint(cameraPosition, this.hex).toIso(gp.camera.position);
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

        // // draw coords
        // const fontSize = (GameObject.BASE_SIZE / 2 * this.scale);
        // ctx.font = fontSize + "px Georgia";
        // ctx.fillStyle="black"
        // ctx.fillText(this.hex.q + "/" + this.hex.r, center.x-fontSize, center.y);
    }

    getNeighborAt(direction) {
        const hex = this.hex;

        const neighborHex = Hex.getNeighborAt(hex, direction);

        let neighbor = null;
        this.board.fields.forEach(f => {
            if (neighbor == null) {
                if (f.hex.equals(neighborHex)) {
                    neighbor = f;
                }
            }
        });

        return neighbor;
    }

    hasNeighborAt(direction) {
        const neighbor = this.getNeighborAt(direction);

        return neighbor != null;
    }

    getNeighbors() {
        const directions = [
            Hex.DIRECTION_TOP_RIGHT,
            Hex.DIRECTION_RIGHT,
            Hex.DIRECTION_BOTTOM_RIGHT,
            Hex.DIRECTION_BOTTOM_LEFT,
            Hex.DIRECTION_LEFT,
            Hex.DIRECTION_TOP_LEFT,
        ];

        const neighbors = directions.map(d => this.getNeighborAt(d)).filter(n => n != null);
        // const neighbors = Hex.getNeighbors(this);

        return neighbors;
    }

    // isBorderField() {
    //     return directions.length != directionsWithNeighbor.length;
    // }

    isNeighborOf(field) {
        const compareHex = field.hex;

        const neighbors = this.getNeighbors();
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i].hex.equals(compareHex)) {
                return true;
            }
        }

        return false;
    }

    onClick() {
        // this.board.selectField(this);
    }
}

Field.TYPE_REGULAR = "regular";
Field.TYPE_HOLE = "hole";
Field.TYPE_HOT_ZONE = "hot_zone";
Field.TYPE_SUPER_HOT_ZONE = "super_hot_zone";
Field.TYPE_PIT = "pit";
Field.TYPE_MIDFIELD = "midfield";

Field.BORDER_WIDTH = GameObject.BASE_SIZE / 50;
