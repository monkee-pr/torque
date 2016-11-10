class GameObject {
    constructor(isMovable = false, isSelectable = false) {
        this.isMovable = isMovable;
        this.isSelectable = isSelectable;

        this.isHovered = false;
    }
    update() {
        if (this.isHovered) console.log("hovered");console.log(go);
    }

    draw(ctx) {

    }

    onClick(gp) {
        console.log(this);
    }
}
