class Player extends GameObject {
    constructor(hex, type, team) {
        super();

        this.hex = hex;
        this.type = type;
        this.team = team;

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
                switch (this.type) {
                    case Player.TYPE_1:
                        this.image = resources.team1Player1;
                        break;
                    case Player.TYPE_2:
                        this.image = resources.team1Player2;
                        break;
                    case Player.TYPE_3:
                        this.image = resources.team1Player3;
                        break;
                }
                break;
            case Team.TEAM_2:
                switch (this.type) {
                    case Player.TYPE_1:
                        this.image = resources.team2Player1;
                        break;
                    case Player.TYPE_2:
                        this.image = resources.team2Player2;
                        break;
                    case Player.TYPE_3:
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

    draw(ctx, cameraMode) {
        const scaledSize = GameObject.BASE_SIZE * this.scale;

        const center = Hex.hexToPoint(this.hex, scaledSize);//, cameraMode == Camera.MODE_ISOMETRIC);

        // calc corner points
        let p0 = new Point(center.x, center.y - scaledSize);                                            // top
        let p1 = new Point(center.x + Math.getTrianglesHeight(scaledSize), center.y - scaledSize/2);    // top right
        let p2 = new Point(center.x + Math.getTrianglesHeight(scaledSize), center.y + scaledSize/2);    // bottom right
        let p3 = new Point(center.x, center.y + scaledSize);                                            // bottom
        let p4 = new Point(center.x - Math.getTrianglesHeight(scaledSize), center.y + scaledSize/2);    // bottom left
        let p5 = new Point(center.x - Math.getTrianglesHeight(scaledSize), center.y - scaledSize/2);    // top left
        if (cameraMode == Camera.MODE_ISOMETRIC) {
            p0 = p0.toIso();
            p1 = p1.toIso();
            p2 = p2.toIso();
            p3 = p3.toIso();
            p4 = p4.toIso();
            p5 = p5.toIso();
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

            if (this.type == Field.TYPE_HOT_ZONE || this.type == Field.TYPE_SUPER_HOT_ZONE) {
                // draw inner circles
                ctx.beginPath();
                const lineWidth = Field.BORDER_WIDTH * this.scale;
                const radius = scaledSize/1.5;
                ctx.arc(center.x, center.y, lineWidth, 0, 2*Math.PI, false);
                ctx.strokeStyle = Color.FIELD_HOLE_CIRCLES;
                const amountOfCircles = 2;
                for (var i = 0; i < amountOfCircles; i++) {
                    ctx.lineWidth = radius * (i+1);
                    ctx.stroke();
                }
            }
        } else if (cameraMode == Camera.MODE_ISOMETRIC) {
            if (this.image != null) {
                const point = Hex.hexToPoint(this.hex, GameObject.BASE_SIZE * this.scale).toIso();
                const width = this.image.width * this.scale;
                const height = this.image.height * this.scale;
                ctx.drawImage(this.image, point.x - width/2, point.y - height/2, width, height);
            }
        }

        // draw border
        if (this.isHighlighted) {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 5;
            ctx.strokeStyle = Color.BORDER_HIGHLIGHT;
        } else if (this.isHovered) {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 2;
            ctx.strokeStyle = Color.BORDER_HOVER;
        } else {
            ctx.lineWidth = Field.BORDER_WIDTH * this.scale;
            ctx.strokeStyle = Color.FIELD_BORDER_REGULAR;
        }
        ctx.stroke();









        // const size = GameObject.BASE_SIZE * this.scale;
        // const center = Hex.hexToPoint(this.hex, size);
        //
        // // draw circle shaped player
        // ctx.beginPath();
        // const radius = size * 0.75;
        // ctx.arc(center.x, center.y, radius, 0, 2*Math.PI, false);
        // switch (this.team.id) {
        //     case Team.TEAM_1:
        //         ctx.fillStyle = Color.PLAYER_TEAM_1;
        //         break;
        //     case Team.TEAM_2:
        //         ctx.fillStyle = Color.PLAYER_TEAM_2;
        //         break;
        //     default:
        //         console.error("invalid team id");
        // }
        // ctx.closePath();
        // ctx.fill();
        //
        // // draw border
        // if (this.isHighlighted) {
        //     ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 5;
        //     ctx.strokeStyle = Color.BORDER_HIGHLIGHT;
        //     ctx.stroke();
        // } else if (this.isHovered) {
        //     ctx.lineWidth = Field.BORDER_WIDTH * this.scale * 2;
        //     ctx.strokeStyle = Color.BORDER_HOVER;
        //     ctx.stroke();
        // }
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
}

Player.TYPE_1 = "type-1";
Player.TYPE_2 = "type-2";
Player.TYPE_3 = "type-3";
