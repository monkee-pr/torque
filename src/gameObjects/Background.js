class Background extends GameObject {
    constructor(image) {
        super();

        this.image = image;
    }
    update() {
        super.update();
    }

    draw(ctx) {
        // const ratioX = Math.ceil(canvas.width / this.image.width)+10;
        // const ratioY = Math.ceil(canvas.height / this.image.height)+10;
        // for (var x = -5; x < ratioX; x++) {
        //     for (var y = -5; y < ratioY; y++) {
        //         ctx.drawImage(this.image, x*this.image.width*this.scale, y*this.image.height*this.scale, this.image.width*this.scale, this.image.height*this.scale);
        //     }
        // }
        const ratio = (100*Camera.scale) + "%";
        this.image.width = ratio;
        this.image.height = ratio;
        const x = this.image;
        const y = x.style;
        var pat = ctx.createPattern(this.image, "repeat");
        ctx.fillStyle = pat;
        ctx.fill();
    }
}
