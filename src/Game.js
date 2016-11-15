class Game {
    constructor() {
        this.cv = document.getElementById("canvas");
        this.ctx = this.cv.getContext("2d");

        // create game panel
        this.gp = new GamePanel(this.cv);

        // add controls
        this.cv.addEventListener("mousemove", e => Control.mouseMove(e, this.gp));
        this.cv.addEventListener("click", e => Control.click(e, this.gp));
        this.cv.addEventListener("mousewheel", e => Control.scroll(e, this.gp));


        this.run();
    }

    run() {
        requestAnimationFrame(() => this.run());

        // do calculations
        this.gp.update();

        this.gp.draw(this.cv);
    }
}
