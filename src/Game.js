class Game {
    constructor() {
        this.cv = document.getElementById('c');
        this.ctx = this.cv.getContext('2d');
        this.gp = new GamePanel(this.ctx);

        this.run();
    }

    run() {
        requestAnimationFrame(() => this.run());

        this.gp.update();

        // draw background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.cv.width, this.cv.height);
        // draw rest of panel
        this.gp.draw();
    }
}
