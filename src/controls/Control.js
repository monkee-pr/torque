const Control = {};
Control.mouseMove = (e, gp) => {
    const target = e.currentTarget;
    const x = e.x - target.offsetLeft;
    const y = e.y - target.offsetTop;
    const point = new Point(x, y);
    // console.log(point);

    const size = GameObject.BASE_SIZE;
    const hex = Point.pointToHex(point, size);
    // console.log(hex);

    // gp.layers.forEach(go => {
    //     if (go.hex != null && hex.q == go.hex.q && hex.r == go.hex.r) {
    //         go.isHovered = true;
    //     } else {
    //         go.isHovered = false;
    //     }
    // });
}

Control.click = (e, gp) => {
    const point = new Point(e.x, e.y);

    const size = GameObject.BASE_SIZE;
    const hex = Point.pointToHex(point, size);

    // reversing the array and breaking after the first hit will make only trigger the onClick of the latest GO added to the array
    const clickableObjects = Object.toArray(gp.layers.layers).reduce((a, b) => {
        return a.concat(b);
    });
    const reversedGameObjects = clickableObjects.slice().reverse();
    let brk = false;
    reversedGameObjects.forEach(go => {
        if (!brk && go.hex != null && hex.q == go.hex.q && hex.r == go.hex.r) {
            go.onClick(gp);
            brk = true;
        }
    });
}

Control.scroll = (e, gp) => {

    const scrollable = GamePanel.cameraMode == GamePanel.CAMERA_MODE_ISOMETRIC;
    if (scrollable) {
        console.log(e);
        const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
        const stepSize = 0.1;
        const step = stepSize * dir;
        // const step = e.deltaY / 100;

        const minScale = 0.25;
        const maxScale = 1;

        GamePanel.scale = Math.max(minScale, Math.min(maxScale, GamePanel.scale * (1 - (step))));
    }
}
