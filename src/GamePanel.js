class GamePanel {
    constructor() {
        this.gameObjects = [];

        this.addGameObject(new Board());
    }

    addGameObject(go) {
        if (!(go instanceof GameObject)) {
            console.error(go + " is not an instance of GameObject");
            return;
        } else {
            this.gameObjects.push(go);
        }
    }
    removeGameObject(go) {

    }

    update() {

    }

    draw(ctx) {
        this.gameObjects.forEach(go => go.draw(ctx));
    }
}
