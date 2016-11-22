class Button extends UIElement {
    constructor(anchor, width, height, title, onClick, onClickParams) {
        super(anchor, width, height);

        this.title = title;
        this.onClickFunc = onClick;
        this.onClickParams = onClickParams == null ? {} : typeof onClickParams != "object" ? {onClickParams} : onClickParams;
    }

    update() {
        super.update();
    }

    draw(ctx, anchor) {
        this.point = anchor;
        const cv = ctx.canvas;

        const tCv = document.createElement("canvas");
        tCv.width = this.width;
        tCv.height = this.height;
        const tCtx = tCv.getContext("2d");

        if (this.isHovered) {
            tCtx.fillStyle = Color.BUTTON_BACKGROUND_HOVER;
        } else {
            tCtx.fillStyle = Color.BUTTON_BACKGROUND;
        }
        tCtx.fillRect(0, 0, tCv.width, tCv.height);
        tCtx.fillStyle = "black";
        tCtx.font="40px Georgia";
        tCtx.fillText(this.title, 10, 50);

        tCtx.strokeStyle = "black";
        tCtx.lineWidth = 5;
        tCtx.rect(0, 0, tCv.width, tCv.height);
        tCtx.stroke();

        ctx.drawImage(tCv, anchor.x, anchor.y, tCv.width, tCv.height);
    }

    onClick(gp) {
        this.onClickFunc(gp, this.onClickParams);
    }
}
