class ActionSelection extends Popup {
    constructor(player) {
        super(new Point(760, 410), 400, 260);

        this.player = player;

        this.buttonRun = new Button(null, 400, 60, "run", this.run, {player:this.player, startHex:this.player.hex});

        this.height += this.buttonRun.height;
        this.point.y -= this.buttonRun.height;
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

        tCtx.fillStyle = "#0f0";
        tCtx.fillRect(0, 0, tCv.width, tCv.height);
        tCtx.fillStyle = "black";
        tCtx.font="40px Georgia";
        let textY = this.buttonRun.height;
        tCtx.fillText("Name: " + this.player.name,10,textY);
        textY+=50;
        tCtx.fillText("Role: " + this.player.role,10,textY);
        textY+=50;
        tCtx.fillText("Rank: " + this.player.rank,10,textY);
        textY+=50;
        tCtx.fillText("Stats: " + this.player.stats,10,textY);
        textY+=50;
        tCtx.fillText("Skills: " + this.player.skills,10,textY);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(0, 0, tCv.width, tCv.height);
        tCtx.stroke();

        ctx.drawImage(tCv, this.point.x, this.point.y + this.buttonRun.height, tCv.width, tCv.height);

        this.buttonRun.draw(ctx, new Point(this.point.x, this.point.y));   // above the info
    }

    run(gp, params) {
        console.log("make player run");
        console.log(params.player);
        gp.closeTopPopup();
        gp.setAction(new Action(Action.TYPE_RUN, params));
    }

    onClick(gp, point) {
        const run = this.buttonRun;
        if (point.hits(run.point, run.width, run.height)) {
            run.onClick(gp);
        }
    }
}
