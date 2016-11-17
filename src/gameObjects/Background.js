class Background extends GameObject {
    constructor(image) {
        super();

        this.image = image;
    }
    update() {
        super.update();
    }

    draw(ctx) {
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
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.fill();
        ctx.translate(-canvas.width/2, -canvas.height/2);
    }
}
