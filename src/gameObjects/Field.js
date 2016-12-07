class Field extends GameObject {
    constructor(gp, hex, type = Field.TYPE_REGULAR, strikeArea) {
        super();

        this.gp = gp;
        this.hex = hex;
        this.type = type;
        this.strikeArea = strikeArea;
        this.isOpen = type == Field.TYPE_HOLE ? false : null;   // only for field of the type "hole"
        this.isSpawnPoint = type == Field.TYPE_MIDFIELD && (hex.q + hex.r)*2 == hex.r ? true : false;

        if (type == Field.TYPE_MIDFIELD) {
            this.teamSide = null;
        } else if (hex.q*2 + hex.r < 0) {
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
                this.color = Color.FIELD_HOLE_CLOSED_BACKGROUND;
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
                        this.image = resources.tileHoleClosedBlue;
                        break;
                    case Team.TEAM_2:
                        this.image = resources.tileHoleClosedRed;
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
            case Field.TYPE_PIT:
            {
                this.image = resources.tilePit;
                break;
            }
            case Field.TYPE_MIDFIELD:
            {
                this.image = resources.tileMidfield;
                break;
            }
        }
    }

    update() {
        super.update();

        if (this.type == Field.TYPE_HOLE) {

            const thisObj = this;
            const boardFields = this.gp.layers.getBoardFields();
            const fieldsOfStrikeArea = boardFields.filter(f => f.strikeArea == thisObj.strikeArea && f.teamSide == thisObj.teamSide);
            const fieldsOfStrikeAreaWithOpposingPlayerHoldingTorque = fieldsOfStrikeArea.filter(f => {
                const go = f.getGameObjects()[0];
                if (go instanceof Player) {
                    const player = go;
                    if (player.team.id != thisObj.teamSide) {
                        const opposingPlayer = player;
                        if (opposingPlayer.holdsTorque()) {
                            return true;
                        }
                    }
                }

                return false;
            });

            if (fieldsOfStrikeAreaWithOpposingPlayerHoldingTorque.length > 0) {
                this.openHole();
            } else {
                this.closeHole();
            }
        }
    }

    draw(ctx) {
        const gp = this.gp;
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
            ctx.font = fontSize + "px Arial";
            ctx.fillStyle="black"
            ctx.textAlign="center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.hex.q + "/" + this.hex.r, center.x, center.y);
        } else if (cameraMode == Camera.MODE_ISOMETRIC) {
            if (this.image != null) {
                if (this.isOpen == true) {
                    const point = Hex.hexToPoint(cameraPosition, this.hex).toIso(gp.camera.position);
                    const width = this.image.width * Camera.scale;
                    const height = this.image.height * Camera.scale;
                    const anchor = new Point(point.x - width/2, point.y-2 - (height - 150*Camera.scale));
                    ctx.drawImage(this.image, anchor.x, anchor.y, width, height);
                } else {
                    const point = Hex.hexToPoint(cameraPosition, this.hex).toIso(cameraPosition);
                    const width = this.image.width * Camera.scale;
                    const height = this.image.height * Camera.scale;
                    ctx.drawImage(this.image, point.x - width/2, point.y-2 - height/2, width, height);
                }
            }
        }

        if (true) {//cameraMode == Camera.MODE_TOP_DOWN || this.type != Field.TYPE_HOLE) {
            // draw border
            let drawBorder = false;
            if (this.type != Field.TYPE_HOLE) {
                // regular border
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale;
                ctx.strokeStyle = Color.FIELD_BORDER_REGULAR;
                drawBorder = true;
            }

            if (this.isSelected && this.isHovered) {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
                ctx.strokeStyle = Color.BORDER_SELECT_HOVER;
                drawBorder = true;
            } else if (this.isSelected) {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
                ctx.strokeStyle = Color.BORDER_SELECT;
                drawBorder = true;
            } else if (this.isHighlighted && this.isHovered) {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
                ctx.strokeStyle = Color.BORDER_HIGHLIGHT_HOVER;
                drawBorder = true;
            } else if (this.isHighlighted) {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
                ctx.strokeStyle = Color.BORDER_HIGHLIGHT;
                drawBorder = true;
            } else if (this.isHovered) {
                ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
                ctx.strokeStyle = Color.BORDER_HOVER;
                drawBorder = true;
            }

            if (drawBorder) ctx.stroke();

            if (this.isHighlighted) {
                const action = this.gp.getAction();
                if (action instanceof RunAction) {
                    let text;
                    if (action.mode == RunAction.MODE_MOVE) {
                        // draw remaining amount of steps in the field
                        text = action.remainingSteps;
                    } else {
                        text = "@";
                    }

                    const point1 = Hex.hexToPoint(cameraPosition, this.hex);
                    const point = cameraMode == Camera.MODE_TOP_DOWN ? point1 : point1.toIso(gp.camera.position);

                    const fontSize = (GameObject.BASE_SIZE / 2 * Camera.scale);
                    ctx.font = fontSize + "px Arial";
                    ctx.fillStyle = Color.BORDER_HIGHLIGHT_HOVER;
                    ctx.textAlign="center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(text, point.x, point.y);
                }
            }
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
        const boardFields = this.gp.layers.getBoardFields();
        boardFields.forEach(f => {
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
        const directions = Hex.ALL_DIRECTIONS;

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

    isNeighborAt(neighbor) {
        const direction = Hex.ALL_DIRECTIONS.filter(d => this.getNeighborAt(d).equals(neighbor))[0];

        if (direction == null) {
            console.log("Hexes are not direct neighbors");
        }

        return direction;
    }

    isEmpty() {
        const empty = this.getGameObjects().length == 0;

        return empty;
    }

    getGameObjects() {
        const gameObjects = this.gp.layers.getGameObjects();
        const objectsOnThisHex = gameObjects.filter(go => {
            return go.hex.equals(this.hex)
        });

        return objectsOnThisHex;
    }

    isAccessible() {
        switch (this.type) {
            case Field.TYPE_HOLE:
                return this.isOpen;
            case Field.TYPE_PIT:
                return false
            default:
                return true;
        }
    }

    onClick() {
        const gp = this.gp;
        const actionControl = gp.getActionControl();
        const action = actionControl.action;
        if (action instanceof RunAction) {
            if (action.mode == RunAction.MODE_MOVE) {
                action.movePlayer(this.hex);

                const gameObjectsOfField = this.getGameObjects();
                const torque = gameObjectsOfField.filter(go => go instanceof Torque)[0];
                if (torque != null) {
                    if (action.player.canHoldTorque()) {
                        action.player.pickUpTorque();
                    } else {
                       torque.scatter();
                    }
                }
            } else {
                action.turnPlayer(this.hex);
            }
        } else if (action instanceof SprintAction) {
            // sprint
        } else if (action instanceof ThrowAction) {
            action.target(this);
            actionControl.submit(this.gp);

            if (this.getGameObjects().filter(go => go instanceof Torque).length > 0) {
                // HOOOLE!!!
                console.log("HOOOLE!!!");
                const scoringTeam = this.teamSide == this.gp.team1.id ? this.gp.team2 : this.gp.team1;
                this.gp.scoreForTeam(scoringTeam);
                if (scoringTeam == this.gp.activeTeam) {
                    this.gp.startNextPush();
                }
                this.gp.respawnTorque();
            }
        }
    }

    openHole() {
        if (this.type == Field.TYPE_HOLE && this.isOpen == false) {
            this.isOpen = true;

            // switch sprite
            switch (this.teamSide) {
                case Team.TEAM_1:
                    this.image = resources.tileHoleOpenedBlue;
                    break;
                case Team.TEAM_2:
                    this.image = resources.tileHoleOpenedRed;
                    break;
            }
            this.color = Color.FIELD_HOLE_OPENED_BACKGROUND;
        }
    }

    closeHole() {
        if (this.type == Field.TYPE_HOLE && this.isOpen == true) {
            this.isOpen = false;

            // switch sprite
            switch (this.teamSide) {
                case Team.TEAM_1:
                    this.image = resources.tileHoleClosedBlue;
                    break;
                case Team.TEAM_2:
                    this.image = resources.tileHoleClosedRed;
                    break;
            }
            this.color = Color.FIELD_HOLE_CLOSED_BACKGROUND;
        }
    }
}

Field.TYPE_REGULAR = "regular";
Field.TYPE_HOLE = "hole";
Field.TYPE_HOT_ZONE = "hot_zone";
Field.TYPE_SUPER_HOT_ZONE = "super_hot_zone";
Field.TYPE_PIT = "pit";
Field.TYPE_MIDFIELD = "midfield";

Field.STRIKE_AREA_BACK = "back";
Field.STRIKE_AREA_LEFT = "left";
Field.STRIKE_AREA_RIGHT = "right";

Field.BORDER_WIDTH = GameObject.BASE_SIZE / 50;
// Field.BORDER_WIDTH = 1;
