class GameObject {
    constructor(isMovable = false, isSelectable = false) {
        this.isMovable = isMovable;
        this.isSelectable = isSelectable;

        this.isHovered = false;

        this.scale = Camera.scale;
    }

    update() {
        this.scale = Camera.scale;
        // if (this.isHovered) console.log("hovered"); console.log(this);
    }

    draw(ctx) {

    }

    onClick(gp) {
        console.log(this);
    }
}

GameObject.BASE_SIZE = 200;  // px for isometric camera mode
// GameObject.BASE_SIZE = 40;  // px for top camera mode
