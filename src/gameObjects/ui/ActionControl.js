class ActionControl extends UIElement {
    constructor(gp, action) {
        const width = 300;
        const height = 60;
        const canvasWidth = 1920;
        const canvasHeight = 1080;
        super(new Point(canvasWidth - width, canvasHeight - height), width, height);
        this.gp = gp;
        this.action = action;

        const buttonWidth = 150;
        const buttonHeight = 60;
        this.submitButton = new Button(new Point(canvasWidth - (buttonWidth+10), canvasHeight - buttonHeight), buttonWidth, buttonHeight, "submit", this.submit, this.action);
        // this.cancelButton = new Button(new Point(canvasWidth - buttonWidth, canvasHeight - buttonHeight), buttonWidth, buttonHeight, "cancel", this.cancel, this.action);

        this.width += this.submitButton.width;
        this.point.x -= this.submitButton.width;
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

        tCtx.fillStyle = Color.UI_BACKGROUND;
        tCtx.fillRect(0, 0, tCv.width, tCv.height);
        tCtx.fillStyle = "black";
        tCtx.font="40px Arial";
        let actionName
        if (this.action instanceof RunAction) {
            actionName = "Run";
        } else if(this.action instanceof ThrowAction) {
            actionName = "Throw";
        } else {
            actionName = "undefined";
        }
        tCtx.fillText("Action: " + actionName, 10, 50);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(0, 0, tCv.width, tCv.height);
        tCtx.stroke();

        ctx.drawImage(tCv, this.point.x, this.point.y);

        // this.cancelButton.draw(ctx);
        this.submitButton.draw(ctx);
    }

    submit(gp) {
        const action = gp.getAction();
        let increaseActionCounter = true;
        if (action instanceof RunAction) {
            const playerMoved = action.remainingMoves != RunAction.MAX_MOVES;
            if (!playerMoved) {
                increaseActionCounter = false;
            }
        } else if (action instanceof ThrowAction) {
            if (action.targetField != null) {
                action.throwTorque();
            } else {
                increaseActionCounter = false;
            }
        } else if (action instanceof BashAction) {
            if (action.targetPlayer != null) {
                action.bash();
            } else {
                increaseActionCounter = false;
            }
        }

        // unselect player
        gp.selectPlayer(gp.selectedPlayer);

        if (increaseActionCounter) gp.submitAction();
    }

    onClick(gp, point) {
        const sub = this.submitButton;
        // const can = this.cancelButton;
        if (point.hits(sub.point, sub.width, sub.height)) {
            sub.onClick(gp);
        // } else if (point.hits(can.point, can.width, can.height)) {
        //     can.onClick(gp);
        }
    }
}
