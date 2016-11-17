const Control = {};
let hoveredHex = null;
Control.mouseMove = (e, gp) => {
    const target = e.target;
    const x = target.width / target.clientWidth * e.clientX;
    const y = target.height / target.clientHeight * e.clientY;
    const point = new Point(x, y);  // x and y are stretched to the actual displayed pixels

    const perspectivePoint = gp.camera.getMode() == Camera.MODE_ISOMETRIC ? point.toRegular() : point;

    const size = GameObject.BASE_SIZE * Camera.scale;
    const hex = Point.pointToHex(perspectivePoint, size);

    if (!(hoveredHex && hoveredHex.equals(hex))) {
        hoveredHex = hex;

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

Control.click = (e, gp) => {
    const target = e.target;
    const x = target.width / target.clientWidth * e.clientX;
    const y = target.height / target.clientHeight * e.clientY;
    const point = new Point(x, y);  // x and y are stretched to the actual displayed pixels

    const perspectivePoint = gp.camera.getMode() == Camera.MODE_ISOMETRIC ? point.toRegular() : point;

    const size = GameObject.BASE_SIZE * Camera.scale;
    const hex = Point.pointToHex(perspectivePoint, size);

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

Control.scroll = (e, gp) => {
    const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
    const stepSize = 0.1;
    const step = stepSize * dir;
    // const step = e.deltaY / 100;

    const oldScale = Camera.scale;
    Camera.scale = Math.max(Camera.MIN_SCALE, Math.min(Camera.MAX_SCALE, Camera.scale * (1 - (step))));
    const newScale = Camera.scale;

    if (oldScale != newScale) {
        console.log(e);
    }
}
