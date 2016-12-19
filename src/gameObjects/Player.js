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

        // images for iso perspective (size of 560x665 px)
        this.imageRegularLeft = null;
        this.imageBashedLeft = null;
        this.imageHoldingLeft = null;
        this.imageRegularRight = null;
        this.imageBashedRight = null;
        this.imageHoldingRight = null;
        switch (this.team.id) {
            case Team.TEAM_1:
                switch (this.role) {
                    case Player.ROLE_MAUL:
                        this.imageRegularLeft = resources.playerMaulBlueRegularLeft;
                        this.imageRegularRight = resources.playerMaulBlueRegularRight;
                        this.imageBashedLeft = resources.playerMaulBlueBashedLeft;
                        this.imageBashedRight = resources.playerMaulBlueBashedRight;
                        this.imageHoldingLeft = resources.playerMaulBlueHoldingLeft;
                        this.imageHoldingRight = resources.playerMaulBlueHoldingRight;
                        break;
                    case Player.ROLE_BLADE:
                        this.imageRegularLeft = resources.playerBladeBlueRegularLeft;
                        this.imageRegularRight = resources.playerBladeBlueRegularRight;
                        this.imageBashedLeft = resources.playerBladeBlueBashedLeft;
                        this.imageBashedRight = resources.playerBladeBlueBashedRight;
                        this.imageHoldingLeft = resources.playerBladeBlueHoldingLeft;
                        this.imageHoldingRight = resources.playerBladeBlueHoldingRight;
                        break;
                    case Player.ROLE_DART:
                        this.imageRegularLeft = resources.playerDartBlueRegularLeft;
                        this.imageRegularRight = resources.playerDartBlueRegularRight;
                        this.imageBashedLeft = resources.playerDartBlueBashedLeft;
                        this.imageBashedRight = resources.playerDartBlueBashedRight;
                        this.imageHoldingLeft = resources.playerDartBlueHoldingLeft;
                        this.imageHoldingRight = resources.playerDartBlueHoldingRight;
                        break;
                }
                break;
            case Team.TEAM_2:
                switch (this.role) {
                    case Player.ROLE_MAUL:
                        this.imageRegularLeft = resources.playerMaulRedRegularLeft;
                        this.imageRegularRight = resources.playerMaulRedRegularRight;
                        this.imageBashedLeft = resources.playerMaulRedBashedLeft;
                        this.imageBashedRight = resources.playerMaulRedBashedRight;
                        this.imageHoldingLeft = resources.playerMaulRedHoldingLeft;
                        this.imageHoldingRight = resources.playerMaulRedHoldingRight;
                        break;
                    case Player.ROLE_BLADE:
                        this.imageRegularLeft = resources.playerBladeRedRegularLeft;
                        this.imageRegularRight = resources.playerBladeRedRegularRight;
                        this.imageBashedLeft = resources.playerBladeRedBashedLeft;
                        this.imageBashedRight = resources.playerBladeRedBashedRight;
                        this.imageHoldingLeft = resources.playerBladeRedHoldingLeft;
                        this.imageHoldingRight = resources.playerBladeRedHoldingRight;
                        break;
                    case Player.ROLE_DART:
                        this.imageRegularLeft = resources.playerDartRedRegularLeft;
                        this.imageRegularRight = resources.playerDartRedRegularRight;
                        this.imageBashedLeft = resources.playerDartRedBashedLeft;
                        this.imageBashedRight = resources.playerDartRedBashedRight;
                        this.imageHoldingLeft = resources.playerDartRedHoldingLeft;
                        this.imageHoldingRight = resources.playerDartRedHoldingRight;
                        break;
                }
                break;
        }
    }

    update(now) {
        super.update(now);

        // handover player's highlight effects to its field
        const field = this.getField();
        field.isSelected = this.isSelected;
        field.isHighlighted = this.isHighlighted;
        field.isHovered = this.isHovered;

        // image
        switch (this.direction) {
            // case Hex.DIRECTION_TOP_RIGHT:
            // case Hex.DIRECTION_RIGHT:
            // case Hex.DIRECTION_BOTTOM_RIGHT:
            case Hex.DIRECTION_RIGHT:
            case Hex.DIRECTION_BOTTOM_RIGHT:
            case Hex.DIRECTION_BOTTOM_LEFT:
                switch (this.status) {
                    case Player.STATUS_BASHED:
                        this.image = this.imageBashedRight;
                        break;
                    case Player.STATUS_HOLD_TORQUE:
                        this.image = this.imageHoldingRight;
                        break;
                    default:
                        this.image = this.imageRegularRight;
                }
                break;
            default:
                switch (this.status) {
                    case Player.STATUS_BASHED:
                        this.image = this.imageBashedLeft;
                        break;
                    case Player.STATUS_HOLD_TORQUE:
                        this.image = this.imageHoldingLeft;
                        break;
                    default:
                        this.image = this.imageRegularLeft;
                }
        }

        // pickup torque if it's on player's field
        const torque = this.getField().getParticipatingObjects().filter(go => go instanceof Torque)[0];
        if (torque != null) {
            const action = this.gp.getAction();
            if (action instanceof ThrowAction) {
                // torque got thrown
                const torqueThrownByTeamMate = action.player.isTeamMateOf(this);
                if (torqueThrownByTeamMate) {
                    // player tries to catch the torque
                    this.pickUpTorque();
                } else {
                    // player gets git by the torque
                    this.fall();
                    torque.scatter();
                }
            } else {
                // player was stepping on torque or torque was scattering to him
                this.pickUpTorque();
            }
        }
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
        } else if (cameraMode == Camera.MODE_ISOMETRIC) {
            const drawImage = () => {
                const image = this.image;
                if (image != null) {
                    const neighborField = this.getField().getNeighborAt(Hex.DIRECTION_TOP_RIGHT);
                    const neighborFieldHasGameObjects = neighborField != null && neighborField.getParticipatingObjects().length > 0;
                    // const neighborFieldIsHovered = neighborField != null && neighborField.isHovered;
                    if (
                        neighborFieldHasGameObjects
                        // && neighborFieldIsHovered
                    ) {
                        ctx.globalAlpha = 0.5;
                    }
                    const point = this.center;

                    if (point) {
                        const width = image.width * Camera.scale;
                        const height = image.height * Camera.scale;
                        const anchor = new Point(point.x - width/2, point.y - (height - 150*Camera.scale));

                        let imageForDirection = null;
                        switch (this.direction) {
                            case Hex.DIRECTION_TOP_RIGHT:
                            case Hex.DIRECTION_RIGHT:
                            case Hex.DIRECTION_BOTTOM_RIGHT:
                            // case Hex.DIRECTION_RIGHT:
                            // case Hex.DIRECTION_BOTTOM_RIGHT:
                            // case Hex.DIRECTION_BOTTOM_LEFT:
                                imageForDirection = image;  // right
                                break;
                            default:
                                imageForDirection = image;
                        }
                        // if (this.hex.equals(new Hex(1, -1))) console.log(imageForDirection);

                        ctx.drawImage(imageForDirection, anchor.x, anchor.y, width, height);
                    }
                    if (
                        neighborFieldHasGameObjects
                        // && neighborFieldIsHovered
                    ) {
                        ctx.globalAlpha = 1;
                    }
                }
            }

            const point = Hex.hexToPoint(cameraPosition, this.hex).toIso(cameraPosition);
            const directionAnchor = this.center;
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

                if (directionAnchor) ctx.drawImage(directionImage, directionAnchor.x - width/2, directionAnchor.y - height/2, width, height);
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
        const theseFields = fields.filter(f => f.hex.equals(this.hex));
        const thisField = theseFields[0];

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

    isInThreadZoneOf(player) {
        const threadZone = player.getThreadZone();
        const players = threadZone.map(f => f.getParticipatingObjects()[0]).filter(po => po instanceof Player);

        return players.indexOf(this) != -1;
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
        const participatingObjectsOfField = this.getField().getParticipatingObjects();
        const torque = participatingObjectsOfField.filter(go => go instanceof Torque)[0];
        if (torque != null) {
            if (!this.isMoving && !torque.isMoving) {
                if (this.canHoldTorque()) {
                    // recognize direction and pickup chance here
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
        // } else {
        //     console.error("wtf");
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

        const bashRolls = this.getBashRolls();
        const playerStrength = this.getStrength();
        const bashResult = Chance.amountSuccessfullRolls(bashRolls, playerStrength);

        let bashWins = false;
        let counterBashWins = false;
        let dodgeWins = false;
        let draw = false;
        const triggerCounterBash = this.isInThreadZoneOf(target);
        if (triggerCounterBash) {
            // trigger counter bash
            const counterBashRolls = target.getCounterBashRolls();
            const targetStrength = target.getStrength();
            const counterBashResult = Chance.amountSuccessfullRolls(counterBashRolls, targetStrength);
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
            const dodgeRolls = target.getDodgeRolls();
            const targetAgility = target.getAgility();
            const dodgeResult = Chance.amountSuccessfullRolls(dodgeRolls, targetAgility);
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

            target.fall();
            const oldTargetField = target.getField();
            const newTargetField = oldTargetField.getNeighborAt(direction);
            if (newTargetField.isEmpty()) {
                target.addMovement(newTargetField.hex);
            }
        } else if (counterBashWins) {
            this.direction = direction;
            target.direction = Hex.mirrorDirection(direction);

            this.fall();
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

    fall() {
        if (this.status == Player.STATUS_HOLD_TORQUE) {
            this.dropTorque();
        }

        this.status = Player.STATUS_BASHED;
    }

    isTeamMateOf(player) {
        return player != null && this.team.id == player.team.id;
    }

    getBashRolls() {
        const baseRolls = 3;

        const rollsAddedByRole = this.role == Player.ROLE_MAUL ? 1 : 0;

        const playerMoved = false;
        const rollsAddedByMovement = playerMoved ? 1 : 0;

        const opposingPlayersInNeighborFields = this.getField().getNeighbors().map(f => f.getParticipatingObjects().filter(po => po instanceof Player)[0]).filter(p => p != null);
        const threateningOpponents = opposingPlayersInNeighborFields.filter(p => this.isInThreadZoneOf(p));
        const amountOfThreateningPlayers = threateningOpponents.length - 1;  // do not consider the player that's about to get bashed -> -1
        const rollsSubtractedByThreateningOpponents = Math.max(amountOfThreateningPlayers, 2);

        const rolls = baseRolls + rollsAddedByRole + rollsAddedByMovement - rollsSubtractedByThreateningOpponents;
        return rolls;
    }

    getCounterBashRolls() {
        const baseRolls = 3;

        const rollsAddedByRole = this.role == Player.ROLE_MAUL ? 1 : 0;

        const opposingPlayersInNeighborFields = this.getField().getNeighbors().map(f => f.getParticipatingObjects().filter(po => po instanceof Player)[0]).filter(p => p != null);
        const threateningOpponents = opposingPlayersInNeighborFields.filter(p => this.isInThreadZoneOf(p));
        const amountOfThreateningPlayers = threateningOpponents.length - 1;  // do not consider the player that's about to get bashed -> -1
        const rollsSubtractedByThreateningOpponents = Math.max(amountOfThreateningPlayers, 2);

        const rolls = baseRolls + rollsAddedByRole - rollsSubtractedByThreateningOpponents;
        return rolls;
    }

    getDodgeRolls() {
        const baseRolls = 3;

        const rollsAddedByRole = this.role == Player.ROLE_DART ? 1 : 0;

        const opposingPlayersInNeighborFields = this.getField().getNeighbors().map(f => f.getParticipatingObjects().filter(po => po instanceof Player)[0]).filter(p => p != null);
        const threateningOpponents = opposingPlayersInNeighborFields.filter(p => this.isInThreadZoneOf(p));
        const amountOfThreateningPlayers = threateningOpponents.length - 1;  // do not consider the player that's about to get bashed -> -1
        const rollsSubtractedByThreateningOpponents = Math.max(amountOfThreateningPlayers, 2);

        const rolls = baseRolls + rollsAddedByRole - rollsSubtractedByThreateningOpponents;
        return rolls;
    }

    getStrength()  {
        switch (this.role) {
            case Player.ROLE_MAUL:
                return 3;
            case Player.ROLE_BLADE:
                return 4;
            case Player.ROLE_DART:
                return 5;
        }
    }

    getAgility()  {
        switch (this.role) {
            case Player.ROLE_MAUL:
                return 4;
            case Player.ROLE_BLADE:
                return 3;
            case Player.ROLE_DART:
                return 3;
        }
    }

    getDexterity()  {
        switch (this.role) {
            case Player.ROLE_MAUL:
                return 5;
            case Player.ROLE_BLADE:
                return 4;
            case Player.ROLE_DART:
                return 3;
        }
    }

    getArmor()  {
        switch (this.role) {
            case Player.ROLE_MAUL:
                return 3;
            case Player.ROLE_BLADE:
                return 4;
            case Player.ROLE_DART:
                return 4;
        }
    }
}

Player.ROLE_MAUL = "maul";
Player.ROLE_BLADE = "blade";
Player.ROLE_DART = "dart";

Player.STATUS_NORMAL = "normal";
Player.STATUS_BASHED = "bashed";
Player.STATUS_HOLD_TORQUE = "hold-torque";
