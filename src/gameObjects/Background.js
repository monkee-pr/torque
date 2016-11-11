class Background extends GameObject {
    constructor(image) {
        super();

        this.image = image;
    }
    update() {
        super.update();
    }

    draw(ctx) {
        const ratioX = Math.ceil(canvas.width / this.image.width)+10;
        const ratioY = Math.ceil(canvas.height / this.image.height)+10;
        for (var x = -5; x < ratioX; x++) {
            for (var y = -5; y < ratioY; y++) {
                // this.rotate(-Game.ROTATE_Z);
                // this.ctx.scale(1,2);
                ctx.drawImage(this.image, x*this.image.width*this.scale, y*this.image.height*this.scale, this.image.width*this.scale, this.image.height*this.scale);
                // ctx.rect(x*this.image.width, y*this.image.height, this.image.width, this.image.height);
                // this.ctx.stroke();
                // this.ctx.scale(1,0.5);
                // this.rotate(Game.ROTATE_Z);
            }
        }
    }

    onClick(gp) {
        console.log(this);
    }
}
