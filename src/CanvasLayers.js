class CanvasLayers {
    constructor() {
        this.layers = {
            // [CanvasLayers.LAYER_BACKGROUND] : [],
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

    draw(ctx, cameraMode) {
        Object.toArray(this.layers).forEach((objects, layer) => {
            // draw layer's objects
            objects.forEach(object => object.draw(ctx, cameraMode));
        });
    }

    getSelectableObjects() {
        const gameObjects = this.layers[CanvasLayers.LAYER_GAME_OBJECTS];

        return gameObjects;
    }

    getHoverableObjects() {
        const fields = this.layers[CanvasLayers.LAYER_BOARD].map(b => b.fields).reduce((a, b) => a.concat(b));
        const gameObjects = this.layers[CanvasLayers.LAYER_GAME_OBJECTS];

        const hoverableObjects = fields.concat(gameObjects);

        return hoverableObjects;
    }
}
// CanvasLayers.LAYER_BACKGROUND = 0;
CanvasLayers.LAYER_BOARD = 0;
CanvasLayers.LAYER_GAME_OBJECTS = 1;
CanvasLayers.LAYER_UI = 2;
