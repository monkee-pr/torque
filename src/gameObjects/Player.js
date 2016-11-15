class Player extends GameObject {
    constructor(hex, team) {
        const isMovable = true;
        const isSelectable = true;
        super(isMovable, isSelectable);

        this.hex = hex;
        this.team = team;

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

        // draw circle shaped player
        ctx.beginPath();
        const radius = size * 0.75;
        ctx.arc(center.x, center.y, radius, 0, 2*Math.PI, false);
        switch (this.team.id) {
            case Team.TEAM_1:
                ctx.fillStyle = Color.PLAYER_TEAM_1;
                break;
            case Team.TEAM_2:
                ctx.fillStyle = Color.PLAYER_TEAM_2;
                break;
            default:
                console.error("invalid team id");
        }
        ctx.closePath();
        ctx.fill();

        // draw border
        if (this.isSelected) {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 5;
            ctx.strokeStyle = Color.FIELD_BORDER_SELECT;
            ctx.stroke();
        } else if (this.isHovered) {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 5;
            ctx.strokeStyle = Color.FIELD_BORDER_HOVER;
            ctx.stroke();
        }
    }

    move() {
        // set new position
        const vector = new Hex(this.vq, this.vr);
        this.hex = Hex.add(this.hex, vector);

        // reset movement
        this.vq = 0;
        this.vr = 0;
    }

    onClick(gp) {
        gp.selectPlayer(this);
    }

    getField() {

    }
}
