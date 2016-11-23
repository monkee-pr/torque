class ActionControl extends UIElement {
    constructor(gp) {
        const width = 250;
        const height = 60;
        const canvasWidth = 1920;
        const canvasHeight = 1080;
        super(new Point(canvasWidth - width, canvasHeight - height), width, height);
        this.gp = gp;
        this.action = gp.getAction();

        const buttonWidth = 150;
        const buttonHeight = 60;
        this.cancelButton = new Button(new Point(canvasWidth - buttonWidth, canvasHeight - buttonHeight), buttonWidth, buttonHeight, "cancel", this.cancel, this.action);
        this.submitButton = new Button(new Point(canvasWidth - (buttonWidth+10)*2, canvasHeight - buttonHeight), buttonWidth, buttonHeight, "submit", this.submit, this.action);

        this.width += this.cancelButton.width + this.submitButton.width;
        this.point.x -= this.cancelButton.width + this.submitButton.width;
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
        tCtx.font="40px Georgia";
        const actionName = this.action instanceof RunAction ? "Run" : "undefined";
        tCtx.fillText("Action: " + actionName, 10, 50);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(0, 0, tCv.width, tCv.height);
        tCtx.stroke();

        ctx.drawImage(tCv, this.point.x, this.point.y);

        this.cancelButton.draw(ctx);
        this.submitButton.draw(ctx);
    }

    cancel() {
        console.log("control -> cancel");
    }

    submit() {
        console.log("control -> submit");
    }
}
