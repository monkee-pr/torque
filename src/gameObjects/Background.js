class Background extends GameObject {
    constructor(image) {
        super();

        this.image = image;
    }
    update() {
        super.update();
    }

    draw(ctx, anchor) {
        const tempCanvas = document.createElement("canvas"),
        tCtx = tempCanvas.getContext("2d");

        const width = this.image.width * this.scale;
        const height = this.image.height * this.scale;
        tempCanvas.width = width;
        tempCanvas.height = height;
        tCtx.drawImage(this.image, 0, 0, width, height);

        ctx.fillStyle = ctx.createPattern(tempCanvas, "repeat");

        // anchor the pattern in the center
        const canvas = ctx.canvas;
        ctx.translate(anchor.x/2, anchor.xy/2);
        ctx.fill();
        ctx.translate(-anchor.x/2, -anchor.xy/2);
    }
}
