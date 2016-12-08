class Player extends ParticipatingObject {
    constructor(gp, hex, id, team, status = Player.STATUS_NORMAL) {
        super(gp, hex);

        this.id = id;
        this.team = team;
        this.status = status;
        this.direction = this.team == this.gp.team1 ? Hex.DIRECTION_RIGHT : Hex.DIRECTION_LEFT; // watch to the opponents side

        // exclude this in a DB later
        let name, role, rank, stats, skills;
        switch (this.id) {
            case 0:
                name = "Sir Maulton";
                role = Player.ROLE_MAUL;
                rank = 1;
                break;
            case 1:
                name = "Ms. Bladeness";
                role = Player.ROLE_BLADE;
                rank = 1;
                break;
            case 2:
                name = "M. von Dart";
                role = Player.ROLE_DART;
                rank = 1;
                break;
        }
        this.name = name;
        this.role = role;
        this.rank = rank;
        this.stats = stats;
        this.skills = skills;

        this.vq = 0;
        this.vr = 0;

        // color for top down perspective
        let fill = true;
        switch (this.team.id) {
            case Team.TEAM_1:
                this.color = Color.TEAM_1;
                break;
            case Team.TEAM_2:
                this.color = Color.TEAM_2;
                break;
        }

        // image for iso perspective
        this.imageRegular = null;  // size of 560x665 px
        this.imageBashed = null;  // size of 560x665 px
        switch (this.team.id) {
            case Team.TEAM_1:
                switch (this.role) {
                    case Player.ROLE_MAUL:
                        this.imageRegular = resources.playerMaulBlueRegular;
                        this.imageBashed = resources.playerMaulBlueBashed;
                        this.imageHolding = resources.playerMaulBlueBashed;
                        break;
                    case Player.ROLE_BLADE:
                        this.imageRegular = resources.playerBladeBlueRegular;
                        this.imageBashed = resources.playerBladeBlueBashed;
                        this.imageHolding = resources.playerBladeBlueHolding;
                        break;
                    case Player.ROLE_DART:
                        this.imageRegular = resources.playerDartBlueRegular;
                        this.imageBashed = resources.playerDartBlueBashed;
                        this.imageHolding = resources.playerDartBlueBashed;
                        break;
                }
                break;
            case Team.TEAM_2:
                switch (this.role) {
                    case Player.ROLE_MAUL:
                        this.imageRegular = resources.playerMaulRedRegular;
                        this.imageBashed = resources.playerMaulRedBashed;
                        this.imageHolding = resources.playerMaulRedBashed;
                        break;
                    case Player.ROLE_BLADE:
                        this.imageRegular = resources.playerBladeRedRegular;
                        this.imageBashed = resources.playerBladeRedBashed;
                        this.imageHolding = resources.playerBladeRedBashed;
                        break;
                    case Player.ROLE_DART:
                        this.imageRegular = resources.playerDartRedRegular;
                        this.imageBashed = resources.playerDartRedBashed;
                        this.imageHolding = resources.playerDartRedBashed;
                        break;
                }
                break;
        }
    }

    update() {
        super.update();

        // this.move();

        const field = this.getField();
        // if (this.gp.getAction() instanceof BashAction && this.hex.equals(new Hex(1, 1))) debugger;
        field.isSelected = this.isSelected;
        field.isHighlighted = this.isHighlighted;
        field.isHovered = this.isHovered;
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

        // const drawBorder = () => {
        //     // draw border
        //     if (this.isHighlighted && this.isHovered) {
        //         ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
        //         ctx.strokeStyle = Color.BORDER_HIGHLIGHT_HOVER;
        //     } else if (this.isHighlighted) {
        //         ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
        //         ctx.strokeStyle = Color.BORDER_HIGHLIGHT;
        //     } else if (this.isHovered) {
        //         ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale * 2;
        //         ctx.strokeStyle = Color.BORDER_HOVER;
        //     } else {
        //         ctx.lineWidth = Field.BORDER_WIDTH * Camera.scale;
        //         ctx.strokeStyle = Color.FIELD_BORDER_REGULAR;
        //     }
        //     ctx.stroke();
        // }

        if (cameraMode == Camera.MODE_TOP_DOWN) {
            // fill area
            if (this.color) {
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            // drawBorder();
        } else if (cameraMode == Camera.MODE_ISOMETRIC) {
            // drawBorder();

            const drawImage = () => {
                switch (this.status) {
                    case Player.STATUS_BASHED:
                        this.image = this.imageBashed;
                        break;
                    case Player.STATUS_HOLD_TORQUE:
                        this.image = this.imageHolding;
                        break;
                    default:
                        this.image = this.imageRegular;
                }

                const image = this.image;
                if (image != null) {
                    const neighborField = this.getField().getNeighborAt(Hex.DIRECTION_TOP_RIGHT);
                    const neighborFieldHasGameObjects = neighborField != null && neighborField.getParticipatingObjects().length > 0;
                    if (neighborFieldHasGameObjects) {
                        ctx.globalAlpha = 0.5;
                    }
                    const point = Hex.hexToPoint(cameraPosition, this.hex).toIso(cameraPosition);
                    const width = image.width * Camera.scale;
                    const height = image.height * Camera.scale;
                    // const anchor = new Point(point.x - width/2, point.y - (height - 150*Camera.scale));
                    const anchor = this.imageAnchor;
                    if (anchor) ctx.drawImage(image, anchor.x, anchor.y, width, height);
                    if (neighborFieldHasGameObjects) {
                        ctx.globalAlpha = 1;
                    }
                }
            }

            const point = Hex.hexToPoint(cameraPosition, this.hex).toIso(cameraPosition);
            const directionAnchor = new Point(point.x, point.y);
            const drawDirection = (direction) => {
                let directionImage = null;
                switch (direction) {
                    case Hex.DIRECTION_TOP_LEFT:
                        switch (this.team.id) {
                            case Team.TEAM_1:
                                directionImage = resources.directionBlueTopLeft;
                                break;
                            case Team.TEAM_2:
                                directionImage = resources.directionRedTopLeft;
                                break;
                        }
                        break;
                    case Hex.DIRECTION_TOP_RIGHT:
                        switch (this.team.id) {
                            case Team.TEAM_1:
                                directionImage = resources.directionBlueTopRight;
                                break;
                            case Team.TEAM_2:
                                directionImage = resources.directionRedTopRight;
                                break;
                        }
                        break;
                    case Hex.DIRECTION_RIGHT:
                        switch (this.team.id) {
                            case Team.TEAM_1:
                                directionImage = resources.directionBlueRight;
                                break;
                            case Team.TEAM_2:
                                directionImage = resources.directionRedRight;
                                break;
                        }
                        break;
                    case Hex.DIRECTION_BOTTOM_RIGHT:
                        switch (this.team.id) {
                            case Team.TEAM_1:
                                directionImage = resources.directionBlueBottomRight;
                                break;
                            case Team.TEAM_2:
                                directionImage = resources.directionRedBottomRight;
                                break;
                        }
                        break;
                    case Hex.DIRECTION_BOTTOM_LEFT:
                        switch (this.team.id) {
                            case Team.TEAM_1:
                                directionImage = resources.directionBlueBottomLeft;
                                break;
                            case Team.TEAM_2:
                                directionImage = resources.directionRedBottomLeft;
                                break;
                        }
                        break;
                    case Hex.DIRECTION_LEFT:
                        switch (this.team.id) {
                            case Team.TEAM_1:
                                directionImage = resources.directionBlueLeft;
                                break;
                            case Team.TEAM_2:
                                directionImage = resources.directionRedLeft;
                                break;
                        }
                        break;
                    default:
                        console.error("Invalid direction");
                }

                const width = directionImage.width * Camera.scale;
                const height = directionImage.height * Camera.scale;

                ctx.drawImage(directionImage, directionAnchor.x - width/2, directionAnchor.y - height/2, width, height);
            }

            const frontDirectionsUnordered = Hex.getFrontDirectionsFrom(this.direction);
            // const frontDirectionsUnordered = Hex.ALL_DIRECTIONS;
            const frontDirections = Hex.sortDirectionsForDraw(frontDirectionsUnordered);

            let drewImage = false;
            frontDirections.forEach(dir => {
                if (
                    !drewImage &&
                    (
                        dir == Hex.DIRECTION_BOTTOM_RIGHT ||
                        dir == Hex.DIRECTION_LEFT ||
                        dir == Hex.DIRECTION_BOTTOM_LEFT
                    )
                ) {
                    drawImage();
                    drewImage = true;
                }
                drawDirection(dir);
            });
            if (!drewImage) drawImage();
        }
    }

    move() {
        // set new position
        const vector = new Hex(this.vq, this.vr);
        this.hex = Hex.add(this.hex, vector);

        // reset movement
        this.vq = 0;
        this.vr = 0;
    }

    changeDirection(direction) {
        this.direction = direction;
    }

    onClick(gp) {
        const actionControl = this.gp.getActionControl();
        const action = this.gp.getAction();
        if (action instanceof RunAction) {
            action.switchMode();
        } else if (action instanceof BashAction && this != action.player) {
            action.target(this);
            actionControl.submit(this.gp);
        } else {
            gp.selectPlayer(this);
        }
    }

    getField() {
        const fields = this.gp.layers.getBoardFields();
        const thisField = fields.filter(f => f.hex.equals(this.hex))[0];

        return thisField;
    }

    getScope() {
        const direction = this.direction;

        const boardFields = this.gp.layers.getBoardFields();

        const hex = this.hex;
        let filterFunc = null;
        switch (direction) {
            case Hex.DIRECTION_TOP_LEFT:
                filterFunc = (f) => (hex.q - f.hex.q) >= (hex.r - f.hex.r)*2*-1;
                break;
            case Hex.DIRECTION_TOP_RIGHT:
                filterFunc = (f) => (hex.q - f.hex.q) <= hex.r - f.hex.r;
                break;
            case Hex.DIRECTION_RIGHT:
                filterFunc = (f) => (hex.q - f.hex.q)*2 <= (hex.r - f.hex.r)*-1;
                break;
            case Hex.DIRECTION_BOTTOM_RIGHT:
                filterFunc = (f) => (hex.q - f.hex.q) <= (hex.r - f.hex.r)*2*-1;
                break;
            case Hex.DIRECTION_BOTTOM_LEFT:
                filterFunc = (f) => (hex.q - f.hex.q) >= hex.r - f.hex.r;
                break;
            case Hex.DIRECTION_LEFT:
                filterFunc = (f) => (hex.q - f.hex.q)*2 >= (hex.r - f.hex.r)*-1;
                break;
            default:
                console.error("Invalid direction");
        }

        return boardFields.filter(filterFunc);
    }

    getThreadZone() {
        const frontDirections = Hex.getFrontDirectionsFrom(this.direction);

        const threadZone = [];
        frontDirections.forEach(d => {
            const neighbor = this.getField().getNeighborAt(d);
            if (neighbor != null) {
                threadZone.push(neighbor);
            }
        });

        return threadZone;
    }

    isInThreadZone(player) {
        const threadZone = this.getThreadZone();
        const players = threadZone.map(f => f.getParticipatingObjects()[0]).filter(go => go instanceof Player);

        return players.indexOf(player) != -1;
    }

    canHoldTorque() {
        if (this.role == Player.ROLE_MAUL) {
            return false;
        } else {
            return true;
        }
    }

    canBash() {
        if (this.role == Player.ROLE_DART) {
            return false;
        } else {
            return true;
        }
    }

    holdsTorque() {
        switch (this.status) {
            case Player.STATUS_HOLD_TORQUE:
                return true;
            default:
                return false;
        }
    }

    // requires a Torque object in the GamePanel's GameObject list
    pickUpTorque() {
        const gp = this.gp;
        const gameObjectsOfField = this.getField().getParticipatingObjects();
        const torque = gameObjectsOfField.filter(go => go instanceof Torque)[0];

        if (torque != null) {
            if (this.canHoldTorque()) {
                // recognize direction and pickup chance here and remove it from GamePanel's respawnTorque() tileHoleOpenedRed
                const pickUpSucceeds = true;
                if (pickUpSucceeds) {
                    this.status = Player.STATUS_HOLD_TORQUE;

                    gp.removeParticipatingObject(torque);
                } else {
                    torque.scatter();
                }

                const action = this.gp.getAction();
                if (action instanceof RunAction && action.player == this) {
                    action.remainingSteps = 0;
                    action.mode = RunAction.MODE_TURN;
                }
            } else {
                torque.scatter();
            }
        }
    }

    throwTorque() {
        if (this.holdsTorque()) {
            this.status = Player.NORMAL;
        }
    }

    dropTorque() {
        this.status = Player.NORMAL;
        const torque = new Torque(this.gp, new Hex(this.hex.q, this.hex.r));
        this.gp.addParticipatingObject(torque);
        torque.scatter();
    }

    bash(target) {
        const direction = Hex.isNeighborAt(this.hex, target.hex);

        const bashResult = 3;   // roll

        let bashWins = false;
        let counterBashWins = false;
        let dodgeWins = false;
        let draw = false;
        const triggerCounterBash = this.isInThreadZone(target);
        if (triggerCounterBash) {
            // trigger counter bash
            const counterBashResult = target.counterBash();
            if (counterBashResult > bashResult) {
                // counter bash succeeded -> player gets bashed
                counterBashWins = true;
            } else if (counterBashResult < bashResult) {
                // counter bash failed -> target gets bashed
                bashWins = true;
            } else {
                // draw -> both players face each other
                draw = true;
            }
        } else {
            // target tries to dodge
            const dodgeResult = target.dodge();
            if (dodgeResult > bashResult) {
                // dodge succeeded
                dodgeWins = true;
            } else if (dodgeResult < bashResult) {
                // dodge failed
                bashWins = true;
            } else {
                // draw
                draw = true;
            }
        }

        if (bashWins) {
            this.direction = direction;
            target.direction = Hex.mirrorDirection(direction);

            target.getBashed();
            const oldTargetField = target.getField();
            const newTargetField = oldTargetField.getNeighborAt(direction);
            if (newTargetField.isEmpty()) {
                target.hex = newTargetField.hex;
            }
        } else if (counterBashWins) {
            this.direction = direction;
            target.direction = Hex.mirrorDirection(direction);

            this.getBashed();
            const oldField = this.getField();
            const newField = oldField.getNeighborAt(Hex.mirrorDirection(direction));
            if (newField.isEmpty()) {
                this.hex = newField.hex;
            }
        } else if (dodgeWins) {
            this.direction = direction;
        } else {
            // draw
            this.direction = direction;
            target.direction = Hex.mirrorDirection(direction);
        }
    }

    counterBash() {
        const rollResult = 2;   // roll

        return rollResult;
    }

    dodge() {
        const rollResult = 0;   // roll

        return rollResult;
    }

    getBashed() {
        if (this.status == Player.STATUS_HOLD_TORQUE) {
            this.dropTorque();
        }

        this.status = Player.STATUS_BASHED;
    }

    isTeamMateOf(player) {
        return player != null && this.team.id == player.team.id;
    }

    actionRun() {

    }

    // add this after demo
    actionSprint() {
    }

    actionBash() {
    }

    actionThrow() {
    }
}

Player.ROLE_MAUL = "maul";
Player.ROLE_BLADE = "blade";
Player.ROLE_DART = "dart";

Player.STATUS_NORMAL = "normal";
Player.STATUS_BASHED = "bashed";
Player.STATUS_HOLD_TORQUE = "hold-torque";
