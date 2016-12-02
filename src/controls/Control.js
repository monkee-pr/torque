const Control = {};

Control.dragAnchor = null;
Control.dragged = false;
Control.dragTolerance = 5;
Control.hoveredHex = null;

Control.mouseDown = (e, gp) => {
    Control.dragAnchor = new Point(e.x, e.y);
}

Control.mouseUp = (e, gp) => {
}

Control.mouseMove = (e, gp) => {
    if (Control.dragAnchor != null) {
        Control.drag(e, gp);
    } else {
        const target = e.target;
        const x = target.width / target.clientWidth * e.clientX;
        const y = target.height / target.clientHeight * e.clientY;
        const point = new Point(x, y);  // x and y are stretched to the actual displayed pixels

        const perspectivePoint = gp.camera.getMode() == Camera.MODE_ISOMETRIC ? point.toRegular(gp.camera.position) : point;

        const anchor = gp.camera.position;
        const hex = Point.pointToHex(anchor, perspectivePoint);

        if (!(Control.hoveredHex && Control.hoveredHex.equals(hex))) {
            Control.hoveredHex = hex;

            const hoverableObjects = gp.layers.getHoverableObjects(gp);
            const reversedGameObjects = hoverableObjects.slice().reverse();
            let brk = false;
            reversedGameObjects.forEach(go => {
                if (!brk && go.hex != null && hex.q == go.hex.q && hex.r == go.hex.r) {
                    go.isHovered = true;
                    brk = true;
                } else {
                    go.isHovered = false;
                }
            });
        }
    }
}

Control.drag = (e, gp) => {
    if (gp.camera.getMode() == Camera.MODE_ISOMETRIC) {
        Control.dragged = true;

        const target = e.target;
        const vx = e.movementX / target.clientWidth * target.width;
        const vy = e.movementY / target.clientHeight * target.height;

        const oldPoint = gp.camera.position;

        gp.camera.position = new Point(oldPoint.x + vx, oldPoint.y + vy);
    }
}

Control.click = (e, gp) => {
    const draggedWidth = Math.abs(e.x - Control.dragAnchor.x);
    const draggedHeight = Math.abs(e.y - Control.dragAnchor.y);
    const draggedDistance = Math.sqrt(Math.pow(draggedWidth, 2) + Math.pow(draggedHeight, 2));
    const dragged = draggedDistance > Control.dragTolerance;
    Control.dragAnchor = null;

    if (!dragged) {
        const target = e.target;
        const x = target.width / target.clientWidth * e.clientX;
        const y = target.height / target.clientHeight * e.clientY;
        const point = new Point(x, y);  // x and y are stretched to the actual displayed pixels

        const uiElements = gp.layers.getUIElements();
        let uiElementClicked = false;
        uiElements.forEach(ui => {
            if (!uiElementClicked && point.hits(ui.point, ui.width, ui.height)) {
                ui.onClick(gp, point);
                uiElementClicked = true;
            }
        });

        if (!uiElementClicked) {
            if (gp.isPopupOpen()) {
                gp.closeTopPopup();
                gp.selectPlayer(gp.selectedPlayer);
            } else {
                const perspectivePoint = gp.camera.getMode() == Camera.MODE_ISOMETRIC ? point.toRegular(gp.camera.position) : point;

                const anchor = gp.camera.position;
                const hex = Point.pointToHex(anchor, perspectivePoint);

                // reversing the array and breaking after the first hit will make only trigger the onClick of the latest GO added to the array
                const clickableObjects = gp.layers.getClickableObjects(gp);
                const reversedGameObjects = clickableObjects.slice().reverse();
                let brk = false;
                reversedGameObjects.forEach(go => {
                    if (!brk && go.hex != null && hex.equals(go.hex)) {
                        go.onClick(gp);
                        // console.log("click");
                        // console.log(go);
                        brk = true;
                    }
                });
            }
        }
    }
    Control.dragged = false;
}

Control.scroll = (e, gp) => {
    const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
    const stepSize = 0.1;
    const step = stepSize * dir;
    // const step = e.deltaY / 100;

    const oldScale = Camera.scale;
    Camera.scale = Math.max(Camera.MIN_SCALE, Math.min(Camera.MAX_SCALE, Camera.scale * (1 - (step))));
    const newScale = Camera.scale;
}
