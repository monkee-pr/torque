class TurnInfo extends UIElement {
    constructor(gp) {
        super(new Point(0, 0), 350, 120);
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
        tCtx.fillStyle = this.gp.activeTeam.id == this.gp.team1.id ? Color.TEAM_1 : Color.TEAM_2;
        tCtx.font="40px Georgia";
        tCtx.fillText("Active Team: " + (this.gp.activeTeam.id == 1 ? "Blue" : "Red"), 10, 50);
        tCtx.fillText("Actions left: " + this.freeActions, 10, 110);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(this.point.x, this.point.y, tCv.width, tCv.height);
        tCtx.stroke();

        ctx.drawImage(tCv, 0, 0);

        this.endTurnButton.draw(ctx);
    }

    onClick(gp, point) {
        const end = this.endTurnButton;
        if (point.hits(end.point, end.width, end.height)) {
            end.onClick(gp);
        }
    }
}
