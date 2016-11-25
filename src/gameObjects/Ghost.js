class Ghost extends Player {
    constructor(gp, hex, id, team) {
        super(gp, hex, id, team);
    }

    update() {
        super.update();
        super.move();
    }

    draw(ctx, gp) {
        ctx.globalAlpha = 0.5;
        super.draw(ctx, gp);
        ctx.globalAlpha = 1;
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
        const fields = this.gp.layers.getBoardFields();
        const thisField = fields.filter(f => f.hex.equals(this.hex));

        return thisField;
    }

    canHoldTorque() {
        if (this.role == Player.ROLE_MAUL) {
            return false;
        } else {
            return true;
        }
    }

    actionRun() {

    }

    // add this after demo
    actionSprint() {
    }

    actionBash() {
    }

    actionThrow() {
    }
}

Player.ROLE_MAUL = "maul";
Player.ROLE_BLADE = "blade";
Player.ROLE_DART = "dart";
