class Game {
    constructor() {
        const cv = document.getElementById("canvas");
        cv.oncontextmenu = (e) => {
            // return false;
            e.preventDefault();
        }

        // create game panel
        this.gp = new GamePanel(cv);

        // add controls
        cv.addEventListener("mousemove", e => Control.mouseMove(e, this.gp));
        cv.addEventListener("mousedown", e => Control.mouseDown(e, this.gp));
        cv.addEventListener("mouseup", e => Control.mouseUp(e, this.gp));
        cv.addEventListener("click", e => Control.click(e, this.gp));
        cv.addEventListener("mousewheel", e => Control.scroll(e, this.gp));


        this.run();
    }

    run() {
        requestAnimationFrame(() => this.run());

        // do calculations
        const now = Date.now();
        this.gp.update(now);

        this.gp.draw();
    }
}
