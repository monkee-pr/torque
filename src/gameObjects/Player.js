class Player extends GameObject {
    constructor(hex, team) {
        const isMovable = true;
        const isSelectable = true;
        super(isMovable, isSelectable);

        this.edgeLength = document.getElementById("canvas").width/50;

        this.hex = hex;
        this.team = team;

        this.vq = 0;
        this.vr = 0;
    }

    update() {
        // this.vq = 1;
        this.move();
    }

    draw(ctx) {
        const center = Hex.hexToPoint(this.hex, this.edgeLength);

        // draw circle shaped player
        ctx.beginPath();
        const radius = this.edgeLength/1.5;
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
