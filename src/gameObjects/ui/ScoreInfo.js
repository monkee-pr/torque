class ScoreInfo extends UIElement {
    constructor(gp) {
        super(new Point(860, 0), 250, 0);
        this.gp = gp;

        this.endTurnButton = new EndTurnButton(this);
        this.height += this.endTurnButton.height;
    }

    update() {
        // super.update();
        this.freeActions = GamePanel.ACTIONS_PER_TURN - this.gp.actionsPerformed;
    }

    draw(ctx) {
        const cv = ctx.canvas;

        const tCv = document.createElement("canvas");
        tCv.width = this.width;
        tCv.height = this.height;
        const tCtx = tCv.getContext("2d");

        tCtx.fillStyle = Color.UI_BACKGROUND;
        tCtx.fillRect(0, 0, tCv.width, tCv.height);
        tCtx.fillStyle = this.gp.score < 0 ? Color.TEAM_1 : this.gp.score > 0 ? Color.TEAM_2 : "black";
        tCtx.font="60px Georgia";
        tCtx.fillText("Score: " + Math.abs(this.gp.score), 10, 50);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(this.point.x, this.point.y, tCv.width, tCv.height);
        tCtx.stroke();

        ctx.drawImage(tCv, this.point.x, this.point.y);
    }
}
