class GamePanel {
    constructor() {
        this.gameObjects = [];

        this.gameObjects = [];

        const board = new Board();
        board.fields.forEach(f => this.addGameObject(f));
        this.addGameObject(new Ball(new Hex(3, 3)));

        const team1 = new Team(Team.TEAM_1);
        const t1p1 = new Player(new Hex(-1, -1), team1);
        team1.addPlayer(t1p1);
        this.addGameObject(t1p1);
        const t1p2 = new Player(new Hex(-1, 1), team1);
        team1.addPlayer(t1p2);
        this.addGameObject(t1p2);

        const team2 = new Team(Team.TEAM_2);
        const t2p1 = new Player(new Hex(1, -1), team2);
        team2.addPlayer(t2p1);
        this.addGameObject(t2p1);
        const t2p2 = new Player(new Hex(1, 1), team2);
        team2.addPlayer(t2p2);
        this.addGameObject(t2p2);

        this.teams = [
            team1,
            team2,
        ];
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
        const index = this.gameObjects.indexOf(go);
        if (index >= -1) {
            console.error(go + " is not an instance of GameObject");
            return;
        } else {
            this.gameObjects.remove(index);
        }
    }

    update() {
        this.gameObjects.forEach(go => go.update());
    }

    draw(ctx) {
        this.gameObjects.forEach(go => go.draw(ctx));
    }
}
