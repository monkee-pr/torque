class Field extends GameObject {
    constructor(board, hex, type = Field.TYPE_REGULAR, strikeArea) {
        super();

        this.board = board;
        this.hex = hex;
        this.type = type;
        this.strikeArea = strikeArea;

        if (hex.q < 0) {
            this.teamSide = Team.TEAM_1;
        } else {
            this.teamSide = Team.TEAM_2;
        }

        // color for top down perspective
        let fill = true;
        switch (this.type) {
            case Field.TYPE_REGULAR:
                break;
            case Field.TYPE_HOLE:
                this.color = Color.FIELD_HOLE_BACKGROUND;
                break;
            case Field.TYPE_HOT_ZONE:
                this.color = Color.FIELD_HOT_ZONE_BACKGROUND;
                break;
            case Field.TYPE_SUPER_HOT_ZONE:
                this.color = Color.FIELD_SUPER_HOT_ZONE_BACKGROUND;
                break;
            case Field.TYPE_PIT:
                this.color = Color.FIELD_PIT_BACKGROUND;
                break;
            case Field.TYPE_MIDFIELD:
                this.color = Color.FIELD_MIDFIELD_BACKGROUND;
                break;
        }

        // image for iso perspective
        switch (this.type) {
            case Field.TYPE_REGULAR:
                break;
            case Field.TYPE_HOLE:
            {
                switch (this.teamSide) {
                    case Team.TEAM_1:
                        this.image = resources.tileGoalBlue;
                        break;
                    case Team.TEAM_2:
                        this.image = resources.tileGoalRed;
                        break;
                }
                break;
            }
            case Field.TYPE_HOT_ZONE:
            {
                switch (this.teamSide) {
                    case Team.TEAM_1:
                        this.image = resources.tileAroundBlueDown;
                        break;
                    case Team.TEAM_2:
                        this.image = resources.tileAroundRedUp;
                        break;
                }
                break;
            }
                break;
            case Field.TYPE_SUPER_HOT_ZONE:
            {
                switch (this.teamSide) {
                    case Team.TEAM_1:
                        this.image = resources.tileSpecialBlueDown;
                        break;
                    case Team.TEAM_2:
                        this.image = resources.tileSpecialRedUp;
                        break;
                }
                break;
            }
                break;
            case Field.TYPE_PIT:
            {
                this.image = resources.tilePit;
                break;
            }
                break;
            case Field.TYPE_MIDFIELD:
            {
                this.image = resources.tileMidfield;
                break;
            }
        }
    }

    update() {
        super.update();
    }

    draw(ctx, gp) {
        const cameraMode = gp.camera.getMode();
        const cameraPosition = gp.camera.position;
        const scaledSize = GameObject.BASE_SIZE * Camera.scale;

        const center = Hex.hexToPoint(cameraPosition, this.hex);

        // calc corner points
        let p0 = new Point(center.x, center.y - scaledSize);                                            // top
        let p1 = new Point(center.x + Math.getTrianglesHeight(scaledSize), center.y - scaledSize/2);    // top right
        let p2 = new Point(center.x + Math.getTrianglesHeight(scaledSize), center.y + scaledSize/2);    // bottom right
        let p3 = new Point(center.x, center.y + scaledSize);                                            // bottom
        let p4 = new Point(center.x - Math.getTrianglesHeight(scaledSize), center.y + scaledSize/2);    // bottom left
        let p5 = new Point(center.x - Math.getTrianglesHeight(scaledSize), center.y - scaledSize/2);    // top left
        if (cameraMode == Camera.MODE_ISOMETRIC) {
            p0 = p0.toIso(cameraPosition);
            p1 = p1.toIso(cameraPosition);
            p2 = p2.toIso(cameraPosition);
            p3 = p3.toIso(cameraPosition);
            p4 = p4.toIso(cameraPosition);
            p5 = p5.toIso(cameraPosition);
        }

        // define border
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.closePath();

        if (cameraMode == Camera.MODE_TOP_DOWN) {
            // fill area
            if (this.color) {
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            // draw coords
            const fontSize = (GameObject.BASE_SIZE / 2 * Camera.scale);
            ctx.font = fontSize + "px Georgia";
            ctx.fillStyle="black"
            ctx.fillText(this.hex.q + "/" + this.hex.r, center.x-fontSize, center.y);
        } else if (cameraMode == Camera.MODE_ISOMETRIC) {
            if (this.image != null) {
                const point = Hex.hexToPoint(cameraPosition, this.hex).toIso(cameraPosition);
                const width = this.image.width * Camera.scale;
                const height = this.image.height * Camera.scale;
                ctx.drawImage(this.image, point.x - width/2, point.y - height/2, width, height);
            }
        }

        if (cameraMode == Camera.MODE_TOP_DOWN || (this.image != resources.tileGoalRed && this.image != resources.tileGoalBlue)) {
            // draw border
            if (this.isHighlighted && this.isHovered) {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
                ctx.strokeStyle = Color.BORDER_HIGHLIGHT_HOVER;
            } else if (this.isHighlighted) {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
                ctx.strokeStyle = Color.BORDER_HIGHLIGHT;
            } else if (this.isHovered) {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
                ctx.strokeStyle = Color.BORDER_HOVER;
            } else {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale;
                ctx.strokeStyle = Color.FIELD_BORDER_REGULAR;
            }

            ctx.stroke();
        }

        if (cameraMode == Camera.MODE_TOP_DOWN && (this.type == Field.TYPE_HOT_ZONE || this.type == Field.TYPE_SUPER_HOT_ZONE)) {
            // draw inner circles
            ctx.beginPath();
            const lineWidth = Field.BORDER_WIDTH * Camera.scale;
            const radius = scaledSize/1.5;
            ctx.arc(center.x, center.y, lineWidth, 0, 2*Math.PI, false);
            ctx.strokeStyle = Color.FIELD_HOLE_CIRCLES;
            const amountOfCircles = 2;
            for (var i = 0; i < amountOfCircles; i++) {
                ctx.lineWidth = radius * (i+1);
                ctx.stroke();
            }
        }
    }

    getNeighborAt(direction) {
        const hex = this.hex;

        const neighborHex = Hex.getNeighborAt(hex, direction);

        let neighbor = null;
        this.board.fields.forEach(f => {
            if (neighbor == null) {
                if (f.hex.equals(neighborHex)) {
                    neighbor = f;
                }
            }
        });

        return neighbor;
    }

    hasNeighborAt(direction) {
        const neighbor = this.getNeighborAt(direction);

        return neighbor != null;
    }

    getNeighbors() {
        const directions = [
            Hex.DIRECTION_TOP_RIGHT,
            Hex.DIRECTION_RIGHT,
            Hex.DIRECTION_BOTTOM_RIGHT,
            Hex.DIRECTION_BOTTOM_LEFT,
            Hex.DIRECTION_LEFT,
            Hex.DIRECTION_TOP_LEFT,
        ];

        const neighbors = directions.map(d => this.getNeighborAt(d)).filter(n => n != null);
        // const neighbors = Hex.getNeighbors(this);

        return neighbors;
    }

    // isBorderField() {
    //     return directions.length != directionsWithNeighbor.length;
    // }

    isNeighborOf(field) {
        const compareHex = field.hex;

        const neighbors = this.getNeighbors();
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i].hex.equals(compareHex)) {
                return true;
            }
        }

        return false;
    }

    isEmpty(gp) {
        const empty = this.getGameObject(gp) == null;

        return empty;
    }

    getGameObject(gp) {
        const gameObjects = gp.layers.getGameObjects();
        const objectOnThisHex = gameObjects.filter(go => go.hex.equals(this.hex))[0];

        return objectOnThisHex;
    }

    isAccessible() {
        switch (this.type) {
            case Field.TYPE_HOLE:
            case Field.TYPE_PIT:
                return false
            default:
                return true;
        }
    }

    onClick(gp) {
        const action = gp.getAction();
        if (action instanceof RunAction) {
            if (action.addFieldToPath(this)) {
                const hasTorque = this.getGameObject(gp) instanceof Torque;
                if (hasTorque) {
                    action.ghost.pickUpTorque(gp);
                }

                action.moveGhost(this.hex);
            }
        }
    }
}

Field.TYPE_REGULAR = "regular";
Field.TYPE_HOLE = "hole";
Field.TYPE_HOT_ZONE = "hot_zone";
Field.TYPE_SUPER_HOT_ZONE = "super_hot_zone";
Field.TYPE_PIT = "pit";
Field.TYPE_MIDFIELD = "midfield";

Field.BORDER_WIDTH = GameObject.BASE_SIZE / 50;
