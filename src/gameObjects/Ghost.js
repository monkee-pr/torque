class Ghost extends Player {
    constructor(gp, hex, id, team, status = Player.STATUS_NORMAL) {
        super(gp, hex, id, team, status);
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
}
