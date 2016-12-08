class GameObject {
    constructor(gp) {
        this.gp = gp;
        this.isHovered = false;
        this.isHighlighted = false;
        this.isSelected = false;
    }

    update() {
        // if (this.isHovered) console.log(this.hex);
    }

    draw(ctx) {
    }
}

GameObject.BASE_SIZE = 250;  // px for isometric camera mode
