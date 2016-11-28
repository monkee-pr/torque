class Player extends GameObject {
    constructor(gp, hex, id, team, status = Player.STATUS_NORMAL) {
        super();

        this.gp = gp;

        this.hex = hex;
        this.id = id;
        this.team = team;
        this.status = status;

        // exclude this in a DB later
        let name, role, rank, stats, skills;
        switch (this.id) {
            case 0:
                name = "player1Team" + this.team.id;
                role = Player.ROLE_MAUL;
                rank = 1;
                break;
            case 1:
                name = "player2Team" + this.team.id;
                role = Player.ROLE_BLADE;
                rank = 1;
                break;
            case 2:
                name = "player3Team" + this.team.id;
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
                        break;
                    case Player.ROLE_BLADE:
                        this.imageRegular = resources.playerBladeBlueRegular;
                        this.imageBashed = resources.playerBladeBlueBashed;
                        break;
                    case Player.ROLE_DART:
                        this.imageRegular = resources.playerDartBlueRegular;
                        this.imageBashed = resources.playerDartBlueBashed;
                        break;
                }
                break;
            case Team.TEAM_2:
                switch (this.role) {
                    case Player.ROLE_MAUL:
                        this.imageRegular = resources.playerMaulRedRegular;
                        this.imageBashed = resources.playerMaulRedBashed;
                        break;
                    case Player.ROLE_BLADE:
                        this.imageRegular = resources.playerBladeRedRegular;
                        this.imageBashed = resources.playerBladeRedBashed;
                        break;
                    case Player.ROLE_DART:
                        this.imageRegular = resources.playerDartRedRegular;
                        this.imageBashed = resources.playerDartRedBashed;
                        break;
                }
                break;
        }
    }

    update() {
        super.update();
        this.move();
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
            p0 = p0.toIso(gp.camera.position);
            p1 = p1.toIso(gp.camera.position);
            p2 = p2.toIso(gp.camera.position);
            p3 = p3.toIso(gp.camera.position);
            p4 = p4.toIso(gp.camera.position);
            p5 = p5.toIso(gp.camera.position);
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

        const drawBorder = () => {
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

        if (cameraMode == Camera.MODE_TOP_DOWN) {
            // fill area
            if (this.color) {
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            drawBorder();
        } else if (cameraMode == Camera.MODE_ISOMETRIC) {
            drawBorder();
            let image = null;
            switch (this.status) {
                case Player.STATUS_BASHED:
                case Player.STATUS_HOLD_TORQUE:
                    image = this.imageBashed;
                    break;
                default:
                    image = this.imageRegular;
            }
            // if (this instanceof Ghost) {
            //     console.log(this.status == Player.STATUS_HOLD_TORQUE);
            // }
            if (image != null) {
                const point = Hex.hexToPoint(cameraPosition, this.hex).toIso(gp.camera.position);
                const width = image.width * Camera.scale;
                const height = image.height * Camera.scale;
                const anchor = new Point(point.x - width/2, point.y - (height - 150*Camera.scale));
                ctx.drawImage(image, anchor.x, anchor.y, width, height);
            }
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

    onClick(gp) {
        gp.selectPlayer(this);
    }

    getField() {
        const fields = this.gp.layers.getBoardFields();
        const thisField = fields.filter(f => f.hex.equals(this.hex))[0];

        return thisField;
    }

    canHoldTorque() {
        if (this.role == Player.ROLE_MAUL) {
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

    pickUpTorque() {
        const gp = this.gp;
        const boardFields = gp.layers.getBoardFields();
        const notEmptyBoardFields = boardFields.filter(f => !f.isEmpty(gp));
        const gameObjectsOfFields = notEmptyBoardFields.map(f => f.getGameObject(gp));
        const torque = gameObjectsOfFields.filter(go => go instanceof Torque)[0];
        if (this.canHoldTorque()) {
            this.status = Player.STATUS_HOLD_TORQUE;

            gp.removeGameObject(torque);
        } else {
            torque.scatter();
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
        this.gp.addGameObject(torque);
        torque.scatter();
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
