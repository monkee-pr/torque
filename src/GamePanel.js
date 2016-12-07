class GamePanel {
    constructor(cv) {
        this.cv = cv;
        this.ctx = cv.getContext("2d");

        // layers for drawable objects
        this.layers = new CanvasLayers();

        this.setBackground(new Background(null, Color.WINDOW_BACKGROUND));

        const board = new Board(this);
        this.addGameObject(board);
        // board.fields.forEach(f => this.addGameObject(f));
        const originField = this.layers.getBoardFields().filter(f => f.hex.equals(new Hex(0, 0)))[0];
        this.camera = new Camera(Hex.hexToPoint(new Point(0, 0), originField.hex), Camera.MODE_ISOMETRIC);
        // this.camera = new Camera(Hex.hexToPoint(new Point(0, 0), originField.hex), Camera.MODE_TOP_DOWN);

        this.addGameObject(new Torque(this, new Hex(0, 0)));

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
        this.addGameObject(t1p1);
        this.addGameObject(t1p2);
        this.addGameObject(t1p3);
        this.addGameObject(t1p4);
        this.addGameObject(t1p5);
        this.addGameObject(t1p6);

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
        this.addGameObject(t2p1);
        this.addGameObject(t2p2);
        this.addGameObject(t2p3);
        this.addGameObject(t2p4);
        this.addGameObject(t2p5);
        this.addGameObject(t2p6);


        this.teams = [
            this.team1,
            this.team2,
        ];

        this.score = 0; // reaches from -7 to 7

        this.startNextPush();

        this.selectedPlayer = null;
        this._actionControl = null;

        this.actionsPerformed = 0;

        this.addUIElement(new TurnInfo(this));
        this.addUIElement(new SwitchPerspective(this));
        this.addUIElement(new ScoreInfo(this));
    }

    setBackground(bg) {
        if (!(bg instanceof Background)) {
            console.error(bg + " is not an instance of Background");
            return;
        }
        this.layers.layers[CanvasLayers.LAYER_BACKGROUND] = [bg];
    }

    addGameObject(go) {
        if (!(go instanceof GameObject)) {
            console.error(go + " is not an instance of GameObject");
            return;
        } else {
            let targetLayer = null;
            if (go instanceof Field || go instanceof Board) {
                targetLayer = CanvasLayers.LAYER_BOARD;
            } else {
                targetLayer = CanvasLayers.LAYER_GAME_OBJECTS;
            }
            this.layers.add(go, targetLayer);
        }
    }
    removeGameObject(go) {
        if (go == null) {
            console.log("Object not found in panel's list");
            console.log(go);
        } else {
            this.layers.remove(go, CanvasLayers.LAYER_GAME_OBJECTS);
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
            console.log("Object not found in panel's list");
            console.log(ui);
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

    update() {
        this.layers.update();
        // const torques = this.layers.getGameObjects().filter(go => go instanceof Torque);
        // console.log(torques.length);

        const boardFields = this.layers.getBoardFields();
        const clickableObjects = this.layers.getClickableObjects(this);
        boardFields.forEach(f => f.isHighlighted = clickableObjects.indexOf(f) != -1);
        clickableObjects.forEach(go => go.isHighlighted = true);
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
        // if (this.actionsPerformed < GamePanel.ACTIONS_PER_TURN) {
        //     this.startNextPush();
        // }

        const gameObjects = this.layers.getGameObjects();
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

            const playersPassing = Array.flatten(passingFields.map(f => f.getGameObjects())).filter(go => go instanceof Player);
            const playerCollidingWith = playersPassing[0];

            if (playerCollidingWith != null) {
                // torque collides with player
                const landingField = passingFields.filter(f => f.getGameObjects().indexOf(playerCollidingWith) != -1)[0];
                torque.hex = new Hex(landingField.hex.q, landingField.hex.r);
                if (false) { // player faces the torque
                    playerCollidingWith.pickUpTorque();
                } else {
                    // bash player
                    torque.scatter();
                }
            } else {
                // torque reaches landing field without any collisions
                const landingField = passingFields[passingFields.length-1];
                torque.hex = new Hex(landingField.hex.q, landingField.hex.r);
            }
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
