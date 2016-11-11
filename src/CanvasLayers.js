class CanvasLayers {
    constructor() {
        this.layers = {
            [CanvasLayers.LAYER_BACKGROUND] : [],
            [CanvasLayers.LAYER_BOARD] : [],
            [CanvasLayers.LAYER_GAME_OBJECTS] : [],
            [CanvasLayers.LAYER_UI] : [],
        };
    }

    add(objects, layer) {
        if (!Array.isArray(objects)) {
            objects = [objects];
        }

        objects.forEach(o => {
            this.layers[layer].push(o);
        });
    }

    remove(objects, layer) {
        if (!Array.isArray(objects)) {
            objects = [objects];
        }

        objects.forEach(o => {
            const index = this.layers[layer].indexOf(o);
            if (index >= -1) {
                this.layers[layer].remove(index);
            } else {
                console.error("GameObject was removed, but not found in CanvasLayer");
            }
        });
    }

    update() {
        Object.toArray(this.layers).forEach(objects => {
            objects.forEach(go => go.update());
        });
    }

    draw(ctx) {
        Object.toArray(this.layers).forEach((objects, layer) => {

            const transform = GamePanel.cameraMode == GamePanel.CAMERA_MODE_ISOMETRIC;

            if (transform) {
                // rotate layer (or not)
                switch (layer) {
                    case CanvasLayers.LAYER_BACKGROUND:
                    case CanvasLayers.LAYER_UI:
                        break;
                    case CanvasLayers.LAYER_BOARD:
                    case CanvasLayers.LAYER_GAME_OBJECTS:
                        this.changeCameraAngle(1);
                        break;
                }
            }

            // draw layer's objects
            objects.forEach(object => object.draw(ctx));

            if (transform) {
                // rotate layer back (or not)
                switch (layer) {
                    case CanvasLayers.LAYER_BACKGROUND:
                    case CanvasLayers.LAYER_UI:
                        break;
                    case CanvasLayers.LAYER_BOARD:
                    case CanvasLayers.LAYER_GAME_OBJECTS:
                        this.changeCameraAngle(0);
                        break;
                }
            }
        });
    }

    // rotates the canvas
    changeCameraAngle(a) {

        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        ctx.translate(canvas.width/2, canvas.height/2);
        let deg = 0;
        if (a == 1) {
            ctx.scale(1, 0.5);
            deg = -CanvasLayers.ROTATE_Z;
        } else {
            deg = CanvasLayers.ROTATE_Z;
        }
        // Move registration point to the center of the canvas
        // ctx.translate(canvas.width/2, canvas.width/2);

        // Rotate 1 degree
        ctx.rotate(deg * Math.PI / 180);

        // Move registration point back to the top left corner of canvas
        // ctx.translate(-canvas.width/2, -canvas.width/2);

        if (a != 1) {
            ctx.scale(1, 2);
        }
        ctx.translate(-canvas.width/2, -canvas.height/2);
    }
}
CanvasLayers.LAYER_BACKGROUND = 0;
CanvasLayers.LAYER_BOARD = 1;
CanvasLayers.LAYER_GAME_OBJECTS = 2;
CanvasLayers.LAYER_UI = 3;

// rotation in degrees
CanvasLayers.ROTATE_Z = 45;
CanvasLayers.ROTATE_Y = 60;
CanvasLayers.ROTATE_X = 0;
