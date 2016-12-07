class CanvasLayers {
    constructor() {
        this.layers = {
            [CanvasLayers.LAYER_BACKGROUND] : [],
            [CanvasLayers.LAYER_BOARD] : [],
            [CanvasLayers.LAYER_HIGHLIGHTS] : [],
            [CanvasLayers.LAYER_GAME_OBJECTS] : [],
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

            const objects1 = layer == CanvasLayers.LAYER_HIGHLIGHTS ? objects : objects.sort(CanvasLayers.sortForDrawing);
            objects1.forEach(object => {
                if (
                    layer < CanvasLayers.LAYER_HIGHLIGHTS &&
                    (
                        object.isHovered ||
                        object.isHighlighted ||
                        object.isSelected ||
                        layer == CanvasLayers.LAYER_BOARD
                    )
                ) {
                    if (layer == CanvasLayers.LAYER_BOARD) {
                        const specialFields = object.fields.filter(f => f.isHovered || f.isHighlighted || f.isSelected);
                        const orderedFields = [].concat(specialFields.filter(f => f.isHighlighted && !f.isHovered)).concat(specialFields.filter(f => f.isSelected && !f.isHovered)).concat(specialFields.filter(f => f.isHovered));
                        this.add(orderedFields, CanvasLayers.LAYER_HIGHLIGHTS);
                    } else {
                        this.add(object, CanvasLayers.LAYER_HIGHLIGHTS);
                    }
                } else if (layer == CanvasLayers.LAYER_BOARD) {
                    // move 3D objects to another layer
                }

                object.draw(ctx, gp);
            });
        });

        this.layers[CanvasLayers.LAYER_HIGHLIGHTS] = [];
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
        let clickableObjects = null;
        const action = gp.getAction();
        if (action instanceof RunAction) {
            const fields = action.getNextPossibleSteps();
            const accessibleFields = fields.filter(f => f.isAccessible());
            clickableObjects = accessibleFields.concat(action.player);
        } else if (action instanceof ThrowAction) {
            clickableObjects = action.possibleTargetFields;
        } else if (action instanceof BashAction) {
            clickableObjects = action.possibleTargets;
        } else {
            clickableObjects = this.getGameObjects();
        }

        return clickableObjects;
    }

    getHoverableObjects(gp) {
        const action = gp.getAction();
        const fields = this.getBoardFields();
        let hoverableFields = fields.filter(f => f.isAccessible());
        if (action instanceof ThrowAction) {
            const openHoles = fields.filter(f => f.type == Field.TYPE_HOLE && f.isOpen == true);
            hoverableFields.push(openHoles);
        // } else if (action instanceof RunAction && action.mode == RunAction.MODE_TURN) {
        //     hoverableFields.push(fields.filter(f => !f.isAccessible()));
        }
        const gameObjects = this.layers[CanvasLayers.LAYER_GAME_OBJECTS];

        const hoverableObjects = hoverableFields.concat(gameObjects);

        return hoverableObjects;
    }
}
CanvasLayers.LAYER_BACKGROUND = 0;
CanvasLayers.LAYER_BOARD = 1;
CanvasLayers.LAYER_HIGHLIGHTS = 2;
CanvasLayers.LAYER_GAME_OBJECTS = 3;
CanvasLayers.LAYER_UI = 4;

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
