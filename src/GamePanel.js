class GamePanel {
    constructor(cv) {
        this.cv = cv;
        this.ctx = cv.getContext("2d");

        this.activeClickBlockers = [];

        // layers for drawable objects
        this.layers = new CanvasLayers();

        this.setBackground(new Background(null, Color.WINDOW_BACKGROUND));

        const board = new Board(this);
        this.setBoard(board);
        // board.fields.forEach(f => this.addParticipatingObject(f));
        const originField = this.layers.getBoardFields().filter(f => f.hex.equals(new Hex(0, 0)))[0];
        this.camera = new Camera(Hex.hexToPoint(new Point(0, 0), originField.hex), Camera.MODE_ISOMETRIC);
        // this.camera = new Camera(Hex.hexToPoint(new Point(0, 0), originField.hex), Camera.MODE_TOP_DOWN);

        this.addParticipatingObject(new Torque(this, new Hex(0, 0)));

        this.team1 = new Team(Team.TEAM_1);
        const t1p1 = new Player(this, new Hex(1, -5), 0, this.team1);
        const t1p2 = new Player(this, new Hex(0, -3), 1, this.team1);
        const t1p3 = new Player(this, new Hex(-1, -1), 2, this.team1);
        const t1p4 = new Player(this, new Hex(-2, 1), 0, this.team1);
        const t1p5 = new Player(this, new Hex(-3, 3), 1, this.team1);
        const t1p6 = new Player(this, new Hex(-4, 5), 2, this.team1);
        this.team1.addPlayer(t1p1);
        this.team1.addPlayer(t1p2);
        this.team1.addPlayer(t1p3);
        this.team1.addPlayer(t1p4);
        this.team1.addPlayer(t1p5);
        this.team1.addPlayer(t1p6);
        this.addParticipatingObject(t1p1);
        this.addParticipatingObject(t1p2);
        this.addParticipatingObject(t1p3);
        this.addParticipatingObject(t1p4);
        this.addParticipatingObject(t1p5);
        this.addParticipatingObject(t1p6);

        this.team2 = new Team(Team.TEAM_2);
        const t2p1 = new Player(this, new Hex(4, -5), 0, this.team2);
        const t2p2 = new Player(this, new Hex(3, -3), 1, this.team2);
        const t2p3 = new Player(this, new Hex(2, -1), 2, this.team2);
        const t2p4 = new Player(this, new Hex(1, 1), 0, this.team2);
        const t2p5 = new Player(this, new Hex(0, 3), 1, this.team2);
        const t2p6 = new Player(this, new Hex(-1, 5), 2, this.team2);
        this.team2.addPlayer(t2p1);
        this.team2.addPlayer(t2p2);
        this.team2.addPlayer(t2p3);
        this.team2.addPlayer(t2p4);
        this.team2.addPlayer(t2p5);
        this.team2.addPlayer(t2p6);
        this.addParticipatingObject(t2p1);
        this.addParticipatingObject(t2p2);
        this.addParticipatingObject(t2p3);
        this.addParticipatingObject(t2p4);
        this.addParticipatingObject(t2p5);
        this.addParticipatingObject(t2p6);


        this.teams = [
            this.team1,
            this.team2,
        ];

        this.score = 0; // reaches from -7 to 7

        this.startNextPush();

        this.selectedPlayer = null;
        this._actionControl = null;

        this.actionsPerformed = 0;

        // this.addUIElement(new TurnInfo(this));
        // this.addUIElement(new SwitchPerspective(this));
        // this.addUIElement(new ScoreInfo(this));
    }

    setBackground(bg) {
        if (!(bg instanceof Background)) {
            console.error(bg + " is not an instance of Background");
        }
        this.layers.layers[CanvasLayers.LAYER_BACKGROUND] = [bg];
    }

    setBoard(board) {
        if (!(board instanceof Board)) {
            console.error(board + " is not an instance of Field");
        } else {
            this.layers.layers[CanvasLayers.LAYER_BOARD] = [board];
        }
    }

    addParticipatingObject(po) {
        if (!(po instanceof ParticipatingObject)) {
            console.error("Object is not an instance of ParticipatingObject");
            console.error(po);
        } else {
            this.layers.add(po, CanvasLayers.LAYER_PARTICIPATING_OBJECTS);
        }
    }
    removeParticipatingObject(po) {
        if (po == null) {
            console.log("Object 'null' not found in panel's list");
        } else {
            this.layers.remove(po, CanvasLayers.LAYER_PARTICIPATING_OBJECTS);
        }
    }

    addUIElement(ui) {
        if (!(ui instanceof UIElement)) {
            console.error(ui + " is not an instance of UIElement");
        } else {
            this.layers.add(ui, CanvasLayers.LAYER_UI);
        }
    }
    removeUIElement(ui) {
        if (ui == null) {
            console.log("Object 'null' not found in panel's list");
        } else {
            this.layers.remove(ui, CanvasLayers.LAYER_UI);
        }
    }

    setAction(action) {
        const actionControl = new ActionControl(this, action);
        this._actionControl = actionControl;
        this.addUIElement(actionControl);
    }
    getActionControl() {
        return this._actionControl;
    }
    getAction() {
        return this._actionControl ? this._actionControl.action : null;
    }
    cancelAction() {
        const actionControl = this._actionControl;
        const action = actionControl ? actionControl.action : null;
        if (action instanceof RunAction) {
            this.layers.getBoardFields().forEach(f => f.isHighlighted = false);
        }

        if (actionControl != null) {
            this.removeUIElement(actionControl);
        }
        this._actionControl = null;
    }
    submitAction() {
        this.actionsPerformed++;

        if (this.actionsPerformed == GamePanel.ACTIONS_PER_TURN) {
            this.startNextPush();
        }
    }

    update(now) {

        const boardFields = this.layers.getBoardFields();
        const gameObjects = this.layers.getParticipatingObjects();
        const fieldsAndGOs = boardFields.concat(gameObjects);
        const clickableObjects = this.layers.getClickableObjects(this);

        let field;
        let player;
        const action = this.getAction();
        if (action instanceof BashAction) {
            field = boardFields.filter(f => f.hex.equals(new Hex(1, 1)))[0];
            player = field.getParticipatingObjects()[0];
            const x = fieldsAndGOs.indexOf(player);
            const y = clickableObjects.indexOf(player);
        }
        // highlight only clickable objects and only during an active action
        boardFields.forEach(f => f.isHighlighted = (action && clickableObjects.indexOf(f) != -1));
        gameObjects.forEach(go => go.isHighlighted = (action && clickableObjects.indexOf(go) != -1));
        // console.log(boardFields.filter(f => f.isHovered));   // why is the open hole hovered always after a score?

        this.layers.update(now);
    }

    draw() {
        // start with fresh canvas
        this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);

        // this.ctx.rect(0, 0, this.cv.width, this.cv.height);

        // draw layers
        this.layers.draw(this.ctx, this);

        // draw canvas border
        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = Color.GAME_BORDER;
        this.ctx.rect(0, 0, this.cv.width, this.cv.height);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    getBoard() {
        return this.layers.layers[CanvasLayers.LAYER_BOARD][0];
    }

    isPopupOpen() {
        const uiElements = this.layers.getUIElements();
        const popups = uiElements.filter(ui => ui instanceof Popup);

        return popups.length > 0;
    }

    closeTopPopup() {
        const uiElements = this.layers.getUIElements();
        const popups = uiElements.filter(ui => ui instanceof Popup);
        const topPopup = popups[popups.length-1];

        this.removeUIElement(topPopup);
    }

    scoreForTeam(team) {
        if (team == this.team1) {
            this.score--;
        } else {
            this.score++;
        }
        console.log("score");
        console.log(this.score);
    }

    respawnTorque() {
        const gameObjects = this.layers.getParticipatingObjects();
        const torque = gameObjects.filter(go => go instanceof Torque)[0];

        if (torque != null) {
            const boardFields = this.layers.getBoardFields();
            const spawnFields = boardFields.filter(f => f.isSpawnPoint);

            const spawnFieldIndex = Math.randomInt(0, spawnFields.length-1);

            let passingFields = null;
            if (this.activeTeam == this.team1) {
                passingFields = spawnFields.slice(0, spawnFieldIndex+1);
            } else {
                passingFields = spawnFields.slice(spawnFieldIndex, spawnFields.length-1+1).reverse();
            }

            const playersPassing = Array.flatten(passingFields.map(f => f.getParticipatingObjects())).filter(go => go instanceof Player);
            const playerCollidingWith = playersPassing[0];

            if (playerCollidingWith != null) {
                // torque collides with player
                const shortenIndex = passingFields.indexOf(playerCollidingWith.getField());
                passingFields.splice(shortenIndex+1);
            }

            const passingHexes = passingFields.map(f => f.hex);
            torque.addMovement(passingHexes);
            torque.hex = this.activeTeam == this.team1 ? new Hex(3, -6) : new Hex(-3, 6);
        }
    }

    startNextPush() {
        if (this.getAction() == null) {
            const index = this.teams.indexOf(this.activeTeam);
            let nextTeamIndex = index+1;
            if (nextTeamIndex >= this.teams.length) {
                nextTeamIndex = 0;
            }

            this.activeTeam = this.teams[nextTeamIndex];
            this.actionsPerformed = 0;
        } else {
            console.error("Can't end a turn with an active action");
        }
    }

    selectPlayer(player) {
        // highlight player
        if (this.selectedPlayer == player) {
            player.isHighlighted = false;
            this.selectedPlayer = null;
            this.cancelAction();
            // } else if (this.selectedPlayer != player) {
            //     if (this.selectedPlayer != null) {
            //         this.selectedPlayer.isHighlighted = false;
            //     }
            //     player.isHighlighted = true;
            //     this.selectedPlayer = player;
        } else if (this.selectedPlayer == null) {
            player.isHighlighted = true;
            this.selectedPlayer = player;

            const playerOfActiveTeam = player.team.id == this.activeTeam.id;
            const uiElement = playerOfActiveTeam ? new ActionSelection(this, player) : new PlayerInfo(player);
            this.addUIElement(uiElement);

            // // highlight neighbor fields
            // const field = this.getBoard().fields.filter(f => f.hex.equals(player.hex))[0];
            // const neighbors = field.getNeighbors();
            // neighbors.forEach(n => n.isHighlighted = true);
        } else {
            // console.log("other player selected");
        }
    }
}
GamePanel.ACTIONS_PER_TURN = 5;
