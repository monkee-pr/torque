class StandUpAction extends Action {
    constructor(gp, player) {
        super();

        this.gp = gp;
        this.player = player;
    }

    standUp() {
        this.player.standUp();
    }
}
