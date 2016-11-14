const Control = {};
Control.mouseMove = (e, gp) => {
    const target = e.currentTarget;
    const x = e.x - target.offsetLeft;
    const y = e.y - target.offsetTop;
    const point = new Point(x, y);
    // console.log(point);

    const size = GameObject.BASE_SIZE * Camera.scale;
    const hex = Point.pointToHex(point, size);
    console.log(hex);

    // this doesn't work because of board instead of fields
    const hoverableGOs = Object.toArray(gp.layers.layers).reduce((a, b) => {
        return a.concat(b);
    });
    hoverableGOs.forEach(go => {
        if (go.hex != null && hex.q == go.hex.q && hex.r == go.hex.r) {
            go.isHovered = true;
            console.log(go);
        } else {
            go.isHovered = false;
        }
    });
    console.log(hoverableGOs);
}

Control.click = (e, gp) => {
    const point = new Point(e.x, e.y);

    const size = GameObject.BASE_SIZE * Camera.scale;
    const hex = Point.pointToHex(point, size);
    console.log(point);
    console.log(hex);

    // // reversing the array and breaking after the first hit will make only trigger the onClick of the latest GO added to the array
    // const clickableObjects = Object.toArray(gp.layers.layers).reduce((a, b) => {
    //     return a.concat(b);
    // });
    // const reversedGameObjects = clickableObjects.slice().reverse();
    // let brk = false;
    // reversedGameObjects.forEach(go => {
    //     if (!brk && go.hex != null && hex.q == go.hex.q && hex.r == go.hex.r) {
    //         go.onClick(gp);
    //         brk = true;
    //     }
    // });
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
