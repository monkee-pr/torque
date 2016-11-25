class Camera {
    constructor(position, mode) {
        this.startPosition = position;
        this.position = position;
        this.setMode(mode);
    }

    getMode() {
        return this._mode;
    }

    setMode(mode) {
        this._mode = mode;

        if (mode == Camera.MODE_ISOMETRIC) {
            Camera.MIN_SCALE = 0.2;
            Camera.MAX_SCALE = 1;
            Camera.scale = Camera.MAX_SCALE;
        } else if (mode == Camera.MODE_TOP_DOWN) {
            Camera.MIN_SCALE = 0.18;
            Camera.MAX_SCALE = 0.18;
            Camera.scale = Camera.MAX_SCALE;
        }

        this.position = this.startPosition;

        const canvas = document.getElementById("canvas");
        this.position = new Point(this.position.x + canvas.width/2, this.position.y + canvas.height/2);

        // Camera.scale = Math.max(Camera.MIN_SCALE, Math.min(Camera.MAX_SCALE, Camera.scale));
    }
}

Camera.scale = 1;

Camera.MODE_ISOMETRIC = "isometric";
Camera.MODE_TOP_DOWN = "top-down";

Camera.MIN_SCALE = 0.25;
Camera.MAX_SCALE = 1;

// transforming data for isometric perspective
Camera.ROTATE_Z = 45;
Camera.SCALE_Y = 0.5;
