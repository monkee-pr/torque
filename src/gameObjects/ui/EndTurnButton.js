class EndTurnButton extends Button {
    constructor(gp) {
        const onClick = () => null;
        super(new Point(0, 0), 300, 60, "End Turn", onClick);
        this.gp = gp;
    }

    update() {
        super.update();
    }

    draw(ctx) {
        const cv = ctx.canvas;

        const tCv = document.createElement("canvas");
        tCv.width = this.width;
        tCv.height = this.height;
        const tCtx = tCv.getContext("2d");

        tCtx.fillStyle = "yellow";
        tCtx.fillRect(0, 0, tCv.width, tCv.height);
        tCtx.fillStyle = "black";
        tCtx.font="40px Georgia";
        tCtx.fillText("Active Team: " + this.gp.activeTeam.id,10,50);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(this.point.x, this.point.y, tCv.width, tCv.height);
        tCtx.stroke();

        ctx.drawImage(tCv, 0, 0);
    }
}
