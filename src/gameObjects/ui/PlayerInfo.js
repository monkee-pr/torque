class PlayerInfo extends Popup {
    constructor(player) {
        super();

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
        tCv.width = 400;
        tCv.height = 260;
        const tCtx = tCv.getContext("2d");

        tCtx.fillStyle = "white";
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

        const x = (cv.width - tCv.width) / 2;
        const y = (cv.height - tCv.height) / 2;
        ctx.drawImage(tCv, x, y, tCv.width, tCv.height);
    }
}
