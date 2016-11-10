class Game {
    constructor() {
        this.cv = document.getElementById("canvas");

        this.ctx = this.cv.getContext("2d");
        this.gp = new GamePanel(this.ctx);

        this.cv.addEventListener('mousemove', e => Control.mouseMove(e, this.gp));
        this.cv.addEventListener('click', e => Control.click(e, this.gp));

        this.run();
    }

    run() {
        requestAnimationFrame(() => this.run());

        // do calculations
        this.gp.update();

        // start with fresh canvas
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw background
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "#000";
        this.ctx.rect(0, 0, this.cv.width, this.cv.height);
        this.ctx.stroke();
        // draw rest of panel
        this.gp.draw(this.ctx);
    }
}
