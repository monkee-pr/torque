class CanvasLayers {
    constructor() {
        this.layers = {
            [CanvasLayers.LAYER_BACKGROUND] : [],
            [CanvasLayers.LAYER_BOARD] : [],
            [CanvasLayers.LAYER_GAME_OBJECTS] : [],
            [CanvasLayers.LAYER_HIGHLIGHTS] : [],
            [CanvasLayers.LAYER_UI] : [],
        };

        this.hideUI = false;    // not fully implemented yet (e.g. the controls)
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
                this.layers[layer].splice(index, 1);
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

    draw(ctx, gp) {
        Object.toArray(this.layers).forEach((objects, layer) => {
            // draw layer's objects
            if (layer == CanvasLayers.LAYER_UI && this.hideUI) {
                return;
            }
            objects.sort(CanvasLayers.sortForDrawing).forEach(object => object.draw(ctx, gp));
        });
    }

    getBoardFields() {
        const fields = this.layers[CanvasLayers.LAYER_BOARD].map(b => b.fields).reduce((a, b) => a.concat(b));

        return fields;
    }

    getUIElements() {
        const uiElements = this.layers[CanvasLayers.LAYER_UI];

        return uiElements;
    }

    getGameObjects() {
        const gameObjects = this.layers[CanvasLayers.LAYER_GAME_OBJECTS];

        return gameObjects;
    }

    getClickableObjects(gp) {
        let clickableObjects = [];
        const action = gp.getAction();
        if (action instanceof RunAction) {
            const fields = action.getNextPossibleSteps();
            clickableObjects = fields.filter(f => f.isAccessible());
        } else if (action instanceof ThrowAction) {
            clickableObjects = action.possibleTargetFields;
        } else {
            clickableObjects = this.getGameObjects();
        }

        return clickableObjects;
    }

    getHoverableObjects(gp) {
        const fields = this.getBoardFields();
        let hoverableFields = fields.filter(f => f.isAccessible());
        if (gp.getAction() instanceof ThrowAction) {
            const openHoles = fields.filter(f => f.type == Field.TYPE_HOLE && f.isOpen == true);
            hoverableFields.push(openHoles);
        }
        const gameObjects = this.layers[CanvasLayers.LAYER_GAME_OBJECTS];

        const hoverableObjects = hoverableFields.concat(gameObjects);

        return hoverableObjects;
    }
}
CanvasLayers.LAYER_BACKGROUND = 0;
CanvasLayers.LAYER_BOARD = 1;
CanvasLayers.LAYER_GAME_OBJECTS = 2;
CanvasLayers.LAYER_HIGHLIGHTS = 3;
CanvasLayers.LAYER_UI = 4;

// CanvasLayers.LAYER_BOARD = 0;
// CanvasLayers.LAYER_GAME_OBJECTS = 1;
// CanvasLayers.LAYER_UI = 2;

CanvasLayers.sortForDrawing = (a, b) => {
    if (!a.hex) {
        return -1;
    } else if (!b.hex) {
        return -1
    } else if (a.hex.q < b.hex.q) {
        return 1;
    } else if (a.hex.q > b.hex.q) {
        return -1;
    } else {
        if (a.hex.r < b.hex.r) {
            return -1;
        } else {
            return 1;
        }
    }
}
