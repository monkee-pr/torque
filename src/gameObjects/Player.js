class Player extends GameObject {
    constructor(gp, hex, id, team) {
        super();

        this.gp = gp;

        this.hex = hex;
        this.id = id;
        this.team = team;

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
                this.color = Color.PLAYER_TEAM_1;
                break;
            case Team.TEAM_2:
                this.color = Color.PLAYER_TEAM_2;
                break;
        }

        // image for iso perspective
        switch (this.team.id) {
            case Team.TEAM_1:
                switch (this.role) {
                    case Player.ROLE_MAUL:
                        this.image = resources.team1Player1;
                        break;
                    case Player.ROLE_BLADE:
                        this.image = resources.team1Player2;
                        break;
                    case Player.ROLE_DART:
                        this.image = resources.team1Player3;
                        break;
                }
                break;
            case Team.TEAM_2:
                switch (this.role) {
                    case Player.ROLE_MAUL:
                        this.image = resources.team2Player1;
                        break;
                    case Player.ROLE_BLADE:
                        this.image = resources.team2Player2;
                        break;
                    case Player.ROLE_DART:
                        this.image = resources.team2Player3;
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
        const scaledSize = GameObject.BASE_SIZE * this.scale;

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

        if (cameraMode == Camera.MODE_TOP_DOWN) {
            // fill area
            if (this.color) {
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        } else if (cameraMode == Camera.MODE_ISOMETRIC) {
            if (this.image != null) {
                const point = Hex.hexToPoint(cameraPosition, this.hex).toIso(gp.camera.position);
                const width = this.image.width * this.scale;
                const height = this.image.height * this.scale;
                ctx.drawImage(this.image, point.x - width/2, point.y - height/2, width, height);
            }
        }

        // draw border
        if (this.isHighlighted) {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 2;
            ctx.strokeStyle = Color.BORDER_HIGHLIGHT;
        } else if (this.isHovered) {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 2;
            ctx.strokeStyle = Color.BORDER_HOVER;
        } else {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale;
            ctx.strokeStyle = Color.FIELD_BORDER_REGULAR;
        }
        ctx.stroke();
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
