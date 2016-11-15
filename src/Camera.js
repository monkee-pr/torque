class Camera {
    constructor(position, mode) {
        this.position = position;
        this.setMode(mode);
    }

    getMode() {
        return this._mode;
    }

    setMode(mode) {
        this._mode = mode;

        if (mode == Camera.MODE_ISOMETRIC) {
            Camera.MIN_SCALE = 0.25;
            Camera.MAX_SCALE = 1;
        } else if (mode == Camera.MODE_TOP_DOWN) {
            Camera.MIN_SCALE = 0.2;
            Camera.MAX_SCALE = 0.2;
        }

        Camera.scale = Math.max(Camera.MIN_SCALE, Math.min(Camera.MAX_SCALE, Camera.scale));
    }
}

// rotates and scales the canvas
Camera.changeAngleToMode = (mode, ctx) => {
    if (mode != this.mode) {
        const canvas = ctx.canvas;

        // move anchor point to center for rotation
        ctx.translate(canvas.width/2, canvas.height/2);

        // rotate and scale
        let deg = 0;
        if (mode == Camera.MODE_ISOMETRIC) {
            ctx.scale(1, 0.5);
            deg = -CanvasLayers.ROTATE_Z;
        } else {
            deg = CanvasLayers.ROTATE_Z;
        }
        ctx.rotate(deg * Math.PI / 180);
        if (mode == Camera.MODE_TOP_DOWN) {
            ctx.scale(1, 2);
        }

        // reset anchor point
        ctx.translate(-canvas.width/2, -canvas.height/2);
    }
}

Camera.scale = 1;

Camera.MODE_ISOMETRIC = "isometric";
Camera.MODE_TOP_DOWN = "top-down";

Camera.MIN_SCALE = 0.25;
Camera.MAX_SCALE = 1;
