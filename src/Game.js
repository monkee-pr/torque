class Game {
    constructor() {
        this.cv = document.getElementById("canvas");
        this.ctx = this.cv.getContext("2d");
        this.gp = new GamePanel(this.ctx);

        this.run();
    }

    run() {
        requestAnimationFrame(() => this.run());

        this.gp.update();

        // draw background
        this.ctx.strokeStyle = "#000";
        this.ctx.rect(0, 0, this.cv.width, this.cv.height);
        this.ctx.stroke();
        // draw rest of panel
        this.gp.draw(this.ctx);
    }
}
