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
        const radius = GameObject.BASE_SIZE * 0.75 * this.scale;
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
