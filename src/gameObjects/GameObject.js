class GameObject {
    constructor() {
        this.isHovered = false;
        this.isHighlighted = false;

        this.scale = Camera.scale;
    }

    update() {
        this.scale = Camera.scale;
        // if (this.isHovered) console.log(this.hex);
    }

    draw(ctx) {

    }

    onClick(gp) {
        console.log(this);
    }
}

GameObject.BASE_SIZE = 250;  // px for isometric camera mode
