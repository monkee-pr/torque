class Game {
    constructor() {
        const cv = document.getElementById("canvas");

        // create game panel
        this.gp = new GamePanel(cv);

        // add controls
        cv.addEventListener("mousemove", e => Control.mouseMove(e, this.gp));
        cv.addEventListener("mousedown", e => Control.mouseDown(e, this.gp));
        cv.addEventListener("mouseup", e => Control.mouseUp(e, this.gp));
        cv.addEventListener("click", e => Control.click(e, this.gp));
        cv.addEventListener("mousewheel", e => Control.scroll(e, this.gp));
        cv.addEventListener("dragstart", e => Control.drag(e, this.gp));


        this.run();
    }

    run() {
        requestAnimationFrame(() => this.run());

        // do calculations
        this.gp.update();

        this.gp.draw();
    }
}
