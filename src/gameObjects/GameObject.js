class GameObject {
    constructor(isMovable = false, isSelectable = false) {
        this.isMovable = isMovable;
        this.isSelectable = isSelectable;

        this.isHovered = false;

        this.scale = GamePanel.scale;
    }

    update() {
        this.scale = GamePanel.scale;
        // if (this.isHovered) console.log("hovered"); console.log(this);
    }

    draw(ctx) {

    }

    onClick(gp) {
        console.log(this);
    }
}

GameObject.BASE_SIZE = 55;  // px for isometric camera mode
// GameObject.BASE_SIZE = 40;  // px for top camera mode
