const Control = {};
Control.mouseMove = (e, gp) => {
    const point = new Point(e.x, e.y);

    const edgeLength = canvas.width/50;
    const hex = Point.pointToHex(point, edgeLength);
    gp.gameObjects.forEach(go => {
        if (go.hex != null && hex.q == go.hex.q && hex.r == go.hex.r) {
            go.isHovered = true;
        } else {
            go.isHovered = false;
        }
    });
}

Control.click = (e, gp) => {
    const point = new Point(e.x, e.y);

    const edgeLength = canvas.width/50;
    const hex = Point.pointToHex(point, edgeLength);

    // reversing the array and breaking after the first hit will make only trigger the onClick of the latest GO added to the array
    const reversedGameObjects = gp.gameObjects.slice().reverse();
    let brk = false;
    reversedGameObjects.forEach(go => {
        if (!brk && go.hex != null && hex.q == go.hex.q && hex.r == go.hex.r) {
            go.onClick(gp);
            brk = true;
        }
    });
}
