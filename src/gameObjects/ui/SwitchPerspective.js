class SwitchPerspective extends Button {
    constructor(gp) {
        const camera = gp.camera;
        const func = (gp, params) => {
            const camera = gp.camera;
            const currentMode = camera.getMode();
            const nextMode = currentMode == Camera.MODE_ISOMETRIC ? Camera.MODE_TOP_DOWN : Camera.MODE_ISOMETRIC;
            camera.setMode(nextMode);
        }
        super(new Point(1920-420, 0), 420, 60, "Perspective: " + camera.getMode(), func, {});
    }

    update() {
        // super.update();
    }

    draw(ctx) {
        super.draw(ctx);
        // const cv = ctx.canvas;
        //
        // const tCv = document.createElement("canvas");
        // tCv.width = this.width;
        // tCv.height = this.height;
        // const tCtx = tCv.getContext("2d");
        //
        // tCtx.fillStyle = Color.UI_BACKGROUND;
        // tCtx.fillRect(0, 0, tCv.width, tCv.height);
        // tCtx.fillStyle = "black";
        // tCtx.font="40px Georgia";
        // const actionName = this.action instanceof RunAction ? "Run" : "undefined";
        // tCtx.fillText("Action: " + actionName, 10, 50);
        //
        // tCtx.strokeStyle = "black";
        // tCtx.lineWidth = 5;
        // tCtx.rect(0, 0, tCv.width, tCv.height);
        // tCtx.stroke();
        //
        // ctx.drawImage(tCv, this.point.x, this.point.y);
        //
        // this.cancelButton.draw(ctx);
        // this.submitButton.draw(ctx);
    }

    // onClick(params) {
    //     const camera = this.gp.camera;
    //     const currentMode = camera.getMode();
    //     const nextMode = currentMode == Camera.MODE_ISOMETRIC ? Camera.MODE_TOP_DOWN : Camera.MODE_ISOMETRIC;
    //     camera.setMode(nextMode);
    // }
}
