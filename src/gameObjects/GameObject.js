class GameObject {
    constructor() {
        this.isHovered = false;
        this.isHighlighted = false;
        this.isSelected = false;
    }

    update() {
        // if (this.isHovered) console.log(this.hex);
    }

    draw(ctx, gp) {
    }

    onClick(gp) {
        // console.log(this);
    }
}

GameObject.BASE_SIZE = 250;  // px for isometric camera mode
