class Field extends GameObject {
    constructor(hex, type = Field.TYPE_REGULAR) {
        super();

        this.hex = hex;
        // if (hex.q == 0 && hex.r == 0) type = Field.TYPE_ORIGIN;
        this.type = type;

        this.edgeLength = 15;
    }

    update() {

    }

    draw(ctx) {
        // calc corner points
        const center = this.hexToPixel(this.hex);
        const p0 = new Point(center.x, center.y - this.edgeLength);                                                 // top
        const p1 = new Point(center.x + Math.getTrianglesHeight(this.edgeLength), center.y - this.edgeLength/2);    // top right
        const p2 = new Point(center.x + Math.getTrianglesHeight(this.edgeLength), center.y + this.edgeLength/2);    // bottom right
        const p3 = new Point(center.x, center.y + this.edgeLength);                                                 // bottom
        const p4 = new Point(center.x - Math.getTrianglesHeight(this.edgeLength), center.y + this.edgeLength/2);    // bottom left
        const p5 = new Point(center.x - Math.getTrianglesHeight(this.edgeLength), center.y - this.edgeLength/2);    // top left

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
        switch (this.type) {
            case Field.TYPE_REGULAR:
                ctx.fillStyle = Color.FIELD_REGULAR_BACKGROUND;
                break;
            case Field.TYPE_HOLE:
                ctx.fillStyle = Color.FIELD_HOLE_BACKGROUND;
                break;
            case Field.TYPE_HOT_ZONE:
                ctx.fillStyle = Color.FIELD_HOT_ZONE_BACKGROUND;
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
            // case Field.TYPE_ORIGIN:
            //     ctx.fillStyle = "white";
                break;
            default:
                debugger;
        }
        ctx.fill();

        // draw border
        ctx.lineWidth = this.edgeLength / 10;
        // ctx.lineJoin = "round";
        // ctx.lineCap = "round";
        ctx.strokeStyle = Color.FIELD_BORDER_REGULAR;
        // ctx.shadowBlur = 1;
        // ctx.shadowColor = "black";
        ctx.stroke();

        if (this.type == Field.TYPE_HOT_ZONE || this.type == Field.TYPE_SUPER_HOT_ZONE) {
            // draw inner circles
            ctx.beginPath();
            ctx.arc(center.x, center.y, 1, 0, 2*Math.PI, false);
            ctx.strokeStyle = Color.FIELD_HOLE_CIRCLES;
            for (var i = 0; i < 2; i++) {
                ctx.lineWidth = 10 * (i+1);
                ctx.stroke();
            }
        }

        // // draw coords
        // ctx.font="10px Georgia";
        // ctx.fillStyle="black"
        // ctx.fillText(this.hex.q + "/" + this.hex.r, center.x-11, center.y);
    }

    hexToPixel(hex) {
        const canvas = document.getElementById("canvas");
        const originFieldAnchor = new Point(canvas.width / 2, canvas.height / 2);
        const x = originFieldAnchor.x + this.edgeLength * Math.sqrt(3) * (hex.q + (hex.r%2 ? 0.5 : 0));
        const y = originFieldAnchor.y + this.edgeLength * 3/2 * hex.r;
        return new Point(x, y);
    }
}

Field.TYPE_REGULAR = "regular";
Field.TYPE_HOLE = "hole";
Field.TYPE_HOT_ZONE = "hot_zone";
Field.TYPE_SUPER_HOT_ZONE = "super_hot_zone";
Field.TYPE_PIT = "pit";
Field.TYPE_MIDFIELD = "midfield";
Field.TYPE_ORIGIN = "origin";
