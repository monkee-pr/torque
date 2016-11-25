class SwitchPerspective extends Button {
    constructor(gp) {
        const camera = gp.camera;
        const func = (gp, params) => {
            const camera = gp.camera;
            const currentMode = camera.getMode();
            const nextMode = currentMode == Camera.MODE_ISOMETRIC ? Camera.MODE_TOP_DOWN : Camera.MODE_ISOMETRIC;
            camera.setMode(nextMode);
            this.title = "Perspective: " + nextMode;
        }
        super(new Point(1920-420, 0), 420, 60, "Perspective: " + camera.getMode(), func, {});
    }

    update() {
        // super.update();
    }

    draw(ctx) {
        super.draw(ctx);
    }
}
