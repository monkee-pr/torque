class GamePanel {
    constructor(cv) {
        this.cv = cv;
        this.ctx = cv.getContext("2d");

        // layers for drawable objects
        this.layers = new CanvasLayers();

        this.setBackground(new Background(resources.sand));

        const board = new Board();
        board.fields.forEach(f => this.addGameObject(f));
        this.addGameObject(new Ball(new Hex(0, 0)));

        this.team1 = new Team(Team.TEAM_1);
        const t1p1 = new Player(new Hex(-2, -1), this.team1);
        // this.team1.addPlayer(t1p1);
        this.addGameObject(t1p1);
        const t1p2 = new Player(new Hex(-2, 1), this.team1);
        // this.team1.addPlayer(t1p2);
        this.addGameObject(t1p2);

        this.team2 = new Team(Team.TEAM_2);
        const t2p1 = new Player(new Hex(1, -1), this.team2);
        // this.team2.addPlayer(t2p1);
        this.addGameObject(t2p1);
        const t2p2 = new Player(new Hex(1, 1), this.team2);
        // this.team2.addPlayer(t2p2);
        this.addGameObject(t2p2);

        // this.addUIElement(new Cursor());
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
            if (go instanceof Field) {
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
        if (!(ui instanceof GameObject)) {
            console.error(ui + " is not an instance of UIElement");
            return;
        } else {
            this.layers.add(ui, CanvasLayers.LAYER_BOARD);
        }
    }

    update() {
        // this.gameObjects.forEach(go => go.update());
        this.layers.update();
    }

    draw() {
        // start with fresh canvas
        this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);

        // draw layers
        this.layers.draw(this.ctx);
        // this.gameObjects.forEach(go => go.draw(this.ctx));

        // draw canvas border
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "#000";
        this.ctx.rect(0, 0, this.cv.width, this.cv.height);
        this.ctx.stroke();
    }
}

GamePanel.CAMERA_MODE_ISOMETRIC = 0;
GamePanel.CAMERA_MODE_TOP = 1;

GamePanel.scale = 1;
GamePanel.cameraMode = true ? GamePanel.CAMERA_MODE_ISOMETRIC : GamePanel.CAMERA_MODE_TOP;
