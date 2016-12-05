class EndTurnButton extends Button {
    constructor(gp) {
        const onClick = (gp) => gp.startNextTurn();
        super(new Point(0, 120), 350, 60, "End Turn", onClick);
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

        tCtx.fillStyle = Color.BUTTON_BACKGROUND;
        tCtx.fillRect(0, 0, tCv.width, tCv.height);
        tCtx.fillStyle = "black";
        tCtx.font="40px Arial";
        tCtx.fillText("End Turn",10,50);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(0, 0, tCv.width, tCv.height);
        tCtx.stroke();

        ctx.drawImage(tCv, this.point.x, this.point.y);
    }
}
