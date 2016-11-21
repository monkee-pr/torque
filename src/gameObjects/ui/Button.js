class Button extends UIElement {
    constructor(title, onClick) {
        super();

        this.title = title;
        this.onClick = onClick;
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
        tCv.height = 60;
        const tCtx = tCv.getContext("2d");

        tCtx.fillStyle = "white";
        tCtx.fillRect(0, 0, tCv.width, tCv.height);
        tCtx.fillStyle = "black";
        tCtx.font="40px Georgia";
        tCtx.fillText(this.title, 10, 50);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(0, 0, tCv.width, tCv.height);
        tCtx.stroke();

        const x = (cv.width - tCv.width) / 2;
        const y = (cv.height - tCv.height) / 2;
        ctx.drawImage(tCv, x, y, tCv.width, tCv.height);
    }

    onClick() {
        this.onClick();
    }
}
