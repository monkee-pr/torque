class Field extends GameObject {
    constructor(board, hex, type = Field.TYPE_REGULAR) {
        super();

        this.board = board;
        this.hex = hex;
        this.type = type;

        this.isHovered = false;
        this.isSelected = false;
    }

    update() {
        super.update();
    }

    draw(ctx) {
        const scaledSize = GameObject.BASE_SIZE * this.scale;

        // calc corner points
        const center = Hex.hexToPoint(this.hex, scaledSize);
        const p0 = new Point(center.x, center.y - scaledSize);                                            // top
        const p1 = new Point(center.x + Math.getTrianglesHeight(scaledSize), center.y - scaledSize/2);    // top right
        const p2 = new Point(center.x + Math.getTrianglesHeight(scaledSize), center.y + scaledSize/2);    // bottom right
        const p3 = new Point(center.x, center.y + scaledSize);                                            // bottom
        const p4 = new Point(center.x - Math.getTrianglesHeight(scaledSize), center.y + scaledSize/2);    // bottom left
        const p5 = new Point(center.x - Math.getTrianglesHeight(scaledSize), center.y - scaledSize/2);    // top left

        // define border
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.closePath();

        // fill area
        let fill = true;
        switch (this.type) {
            case Field.TYPE_REGULAR:
                // ctx.fillStyle = Color.FIELD_REGULAR_BACKGROUND;
                fill = false;
                break;
            case Field.TYPE_HOLE:
                ctx.fillStyle = Color.FIELD_HOLE_BACKGROUND;
                break;
            case Field.TYPE_HOT_ZONE:
                // ctx.fillStyle = Color.FIELD_HOT_ZONE_BACKGROUND;
                fill = false;
                break;
            case Field.TYPE_SUPER_HOT_ZONE:
                ctx.fillStyle = Color.FIELD_SUPER_HOT_ZONE_BACKGROUND;
                break;
            case Field.TYPE_PIT:
                ctx.fillStyle = Color.FIELD_PIT_BACKGROUND;
                break;
            case Field.TYPE_MIDFIELD:
                ctx.fillStyle = Color.FIELD_MIDFIELD_BACKGROUND;
                break;
            default:
        }
        if (fill) ctx.fill();

        // draw border
        // ctx.lineJoin = "round";
        // ctx.lineCap = "round";
        if (this.isSelected) {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 5;
            ctx.strokeStyle = Color.FIELD_BORDER_SELECT;
        } else if (this.isHovered) {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 2;
            ctx.strokeStyle = Color.FIELD_BORDER_HOVER;
        } else {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale;
            ctx.strokeStyle = Color.FIELD_BORDER_REGULAR;
        }
        // ctx.shadowBlur = 1;
        // ctx.shadowColor = "black";
        ctx.stroke();

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

Field.BORDER_WIDTH = GameObject.BASE_SIZE / 40 * 2;
