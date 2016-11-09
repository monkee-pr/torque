class GamePanel {
    contructor(ctx) {
        this.ctx = ctx;

        this.gameObjects = [];

        this.board = new Board();
    }

    addGameObject(go) {
        if (!(go instanceof GameObject)) {
            console.error(go + " is not an insance of GameObject");
            return;
        }
    }
    removeGameObject(go) {

    }

    update() {

    }

    draw() {

    }
}
