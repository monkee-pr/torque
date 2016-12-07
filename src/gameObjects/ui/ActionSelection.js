class ActionSelection extends Popup {
    constructor(gp, player) {
        super(new Point(760, 410), 450, 260);

        this.player = player;

        this.buttonRun = new Button(null, 450, 60, "run", this.run, {player});

        const tempThrowAction = new ThrowAction(gp, player);
        const throwingIsPossible = player.holdsTorque() && tempThrowAction.possibleTargetFields.length > 0;
        this.buttonThrow = throwingIsPossible ? new Button(null, 450, 60, "throw", this.throwTorque, {player}) : null;

        this.height += this.buttonRun.height + (this.buttonThrow ? this.buttonThrow.height : 0);
        this.point.y -= this.buttonRun.height + (this.buttonThrow ? this.buttonThrow.height : 0);
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

        tCtx.fillStyle = Color.UI_BACKGROUND;
        tCtx.fillRect(0, 0, tCv.width, tCv.height);
        tCtx.fillStyle = "black";
        tCtx.font="40px Arial";
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

        ctx.drawImage(tCv, this.point.x, this.point.y + this.buttonRun.height + (this.buttonThrow ? this.buttonThrow.height : 0), tCv.width, tCv.height);

        this.buttonRun.draw(ctx, new Point(this.point.x, this.point.y));   // above the info
        if (this.buttonThrow) {
            this.buttonThrow.draw(ctx, new Point(this.point.x, this.point.y + 60));   // above the info
        }
    }

    run(gp, params) {
        const player = params.player;
        gp.closeTopPopup();
        gp.setAction(new RunAction(gp, player));
    }

    throwTorque(gp, params) {
        const player = params.player;
        if (player.holdsTorque()) {
            gp.closeTopPopup();
            gp.setAction(new ThrowAction(gp, player));
        } else {
            console.log("Can't throw without holding the torque");
        }
    }

    onClick(gp, point) {
        const r = this.buttonRun;
        const t = this.buttonThrow;
        if (point.hits(r && r.point, r.width, r.height)) {
            r.onClick(gp);
        } else if(t && point.hits(t.point, t.width, t.height)) {
            t.onClick(gp);
        }
    }
}
