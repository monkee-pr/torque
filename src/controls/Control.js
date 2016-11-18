const Control = {};

Control.dragAnchor = null;
Control.dragged = false;
Control.hoveredHex = null;

Control.mouseDown = (e, gp) => {
    Control.dragAnchor = new Point(e.x, e.y);
}

Control.mouseUp = (e, gp) => {
    Control.dragAnchor = null;
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

        const size = GameObject.BASE_SIZE * Camera.scale;
        const anchor = gp.camera.position;
        const hex = Point.pointToHex(anchor, perspectivePoint, size);

        if (!(Control.hoveredHex && Control.hoveredHex.equals(hex))) {
            Control.hoveredHex = hex;

            const hoverableObjects = gp.layers.getHoverableObjects();
            const reversedGameObjects = hoverableObjects.slice().reverse();
            let brk = false;
            reversedGameObjects.forEach(go => {
                if (!brk && go.hex != null && hex.q == go.hex.q && hex.r == go.hex.r) {
                    go.isHovered = true;
                    // console.log(go);
                    brk = true;
                } else {
                    go.isHovered = false;
                }
            });
        }
    }
}

Control.drag = (e, gp) => {
    Control.dragged = true;

    const target = e.target;
    const vx = e.movementX / target.clientWidth * target.width;
    const vy = e.movementY / target.clientHeight * target.height;

    const oldPoint = gp.camera.position;

    gp.camera.position = new Point(oldPoint.x + vx, oldPoint.y + vy);
}

Control.click = (e, gp) => {
    if (!Control.dragged) {
        if (gp.isPopupOpen()) {
            gp.closeTopPopup();
            gp.selectPlayer(gp.selectedPlayer);
        } else {
            const target = e.target;
            const x = target.width / target.clientWidth * e.clientX;
            const y = target.height / target.clientHeight * e.clientY;
            const point = new Point(x, y);  // x and y are stretched to the actual displayed pixels

            const perspectivePoint = gp.camera.getMode() == Camera.MODE_ISOMETRIC ? point.toRegular(gp.camera.position) : point;

            const size = GameObject.BASE_SIZE * Camera.scale;
            const anchor = gp.camera.position;
            const hex = Point.pointToHex(anchor, perspectivePoint, size);

            // reversing the array and breaking after the first hit will make only trigger the onClick of the latest GO added to the array
            const clickableObjects = gp.layers.getSelectableObjects();
            const reversedGameObjects = clickableObjects.slice().reverse();
            let brk = false;
            reversedGameObjects.forEach(go => {
                if (!brk && go.hex != null && hex.equals(go.hex)) {
                    go.onClick(gp);
                    brk = true;
                }
            });
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

    if (oldScale != newScale) {
        // console.log(e);
    }
}
