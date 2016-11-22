class PlayerInfo extends Popup {
    constructor(player) {
        super(new Point(760, 410), 400, 260);

        this.player = player;
    }

    update() {
        super.update();
    }

    draw(ctx) {
        const cv = ctx.canvas;
        ctx.globalAlpha = 0.5;
        ctx.fillStyle="black";
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.globalAlpha = 1;

        const tCv = document.createElement("canvas");
        tCv.width = this.width;
        tCv.height = this.height;
        const tCtx = tCv.getContext("2d");

        tCtx.fillStyle = Color.POPUP_BACKGROUND;
        tCtx.fillRect(0, 0, tCv.width, tCv.height);
        tCtx.fillStyle = "black";
        tCtx.font="40px Georgia";
        tCtx.fillText("Name: " + this.player.name,10,50);
        tCtx.fillText("Role: " + this.player.role,10,100);
        tCtx.fillText("Rank: " + this.player.rank,10,150);
        tCtx.fillText("Stats: " + this.player.stats,10,200);
        tCtx.fillText("Skills: " + this.player.skills,10,250);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(0, 0, tCv.width, tCv.height);
        tCtx.stroke();

        ctx.drawImage(tCv, this.point.x, this.point.y, tCv.width, tCv.height);
    }
}
