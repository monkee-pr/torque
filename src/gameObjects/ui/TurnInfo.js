class TurnInfo extends UIElement {
    constructor(gp) {
        super(new Point(0, 0), 350, 60);
        this.gp = gp;
    }

    update() {
        // super.update();
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
        tCtx.fillText("Active Team: " + (this.gp.activeTeam.id == 1 ? "Blue" : "Red"),10,50);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(this.point.x, this.point.y, tCv.width, tCv.height);
        tCtx.stroke();

        ctx.drawImage(tCv, 0, 0);
    }
}
