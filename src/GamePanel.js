class GamePanel {
    constructor(cv) {
        this.cv = cv;
        this.ctx = cv.getContext("2d");

        const point = new Point(this.cv.width/2, this.cv.height/2);
        // this.camera = new Camera(point, Camera.MODE_TOP_DOWN);
        this.camera = new Camera(point, Camera.MODE_ISOMETRIC);

        // layers for drawable objects
        this.layers = new CanvasLayers();

        // this.setBackground(new Background(resources.tileGoalRed));

        const board = new Board();
        this.addGameObject(board);
        // board.fields.forEach(f => this.addGameObject(f));

        this.addGameObject(new Ball(new Hex(0, 0)));

        this.team1 = new Team(Team.TEAM_1);
        const t1p1 = new Player(this, new Hex(-2, -1), 0, this.team1);
        const t1p2 = new Player(this, new Hex(-1, 0), 1, this.team1);
        this.team1.addPlayer(t1p1);
        this.team1.addPlayer(t1p2);
        this.addGameObject(t1p1);
        this.addGameObject(t1p2);

        this.team2 = new Team(Team.TEAM_2);
        const t2p1 = new Player(this, new Hex(1, -1), 0, this.team2);
        const t2p2 = new Player(this, new Hex(1, 1), 1, this.team2);
        this.team2.addPlayer(t2p1);
        this.team2.addPlayer(t2p2);
        this.addGameObject(t2p1);
        this.addGameObject(t2p2);

        this.teams = [
            this.team1,
            this.team2,
        ];

        this.startNextTurn();

        this.selectedPlayer = null;
        this._action = null;

        this.addUIElement(new TurnInfo(this));
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
        this.layers.remove(go, CanvasLayers.LAYER_GAME_OBJECTS);
    }

    addUIElement(ui) {
        if (!(ui instanceof UIElement)) {
            console.error(ui + " is not an instance of UIElement");
        } else {
            this.layers.add(ui, CanvasLayers.LAYER_UI);
        }
    }
    removeUIElement(ui) {
        this.layers.remove(ui, CanvasLayers.LAYER_UI);
    }

    setAction(action) {
        this._action = action;
        console.log("action");
        console.log(action);
        if (action instanceof RunAction) {
            const nextPossibleSteps = action.getNextPossibleSteps();
            nextPossibleSteps.forEach(f => {
                f.isHighlighted = true;
            });
        }
    }
    getAction() {
        return this._action;
    }
    cancelAction() {
        const action = this._action;
        if (action && action.type == Action.TYPE_RUN) {
            this.layers.getBoardFields().forEach(f => f.isHighlighted = false);
        }
        this._action = null;
    }

    update() {
        // this.gameObjects.forEach(go => go.update());
        this.layers.update();
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

    startNextTurn() {
        const index = this.teams.indexOf(this.activeTeam);
        let nextTeamIndex = index+1;
        if (nextTeamIndex >= this.teams.length) {
            nextTeamIndex = 0;
        }

        this.activeTeam = this.teams[nextTeamIndex];
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
            const uiElement = playerOfActiveTeam ? new ActionSelection(player) : new PlayerInfo(player);
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
