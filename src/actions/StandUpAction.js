class StandUpAction extends Action {
    constructor(gp, player) {
        super();

        this.gp = gp;
        this.player = player;
        this.mode = StandUpAction.MODE_CALCULATE;
        console.log("create SUA");
    }

    standUp() {
        console.log("stand up");
        if (this.player.standUp()) {
            // standup succeeded
            this.mode = StandUpAction.MODE_TURN;
            console.log("success");
        } else {
            this.gp.getActionControl().submit(this.gp);
            console.log("fail");
        }
    }

    getNextPossibleSteps() {
        const field = this.player.getField();
        const neighborFields = field.getNeighbors();

        if (this.mode == RunAction.MODE_MOVE) {
            const emptyNeighbors = neighborFields.filter(n => ((n.isEmpty() || n.getParticipatingObjects().filter(go => go instanceof Torque).length > 0) && n.isAccessible()));

            return emptyNeighbors;
        } else {
            return neighborFields;
        }
    }

    turnPlayer(hex) {
        const direction = Hex.isNeighborAt(this.player.hex, hex);
        if (direction != null) {
            this.player.direction = direction;
            this.playerMoved = true;
        } else {
            console.error("Can't turn player. Invalid direction");
        }
    }
}
StandUpAction.MODE_CALCULATE = "calculate";
StandUpAction.MODE_TURN = "turn";
