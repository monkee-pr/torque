class RunAction extends Action {
    constructor(gp, player) {
        super();

        this.gp = gp;
        this.player = player;
        this.path = [];
        this.remainingSteps = RunAction.MAX_STEPS;

        this.mode = RunAction.MODE_MOVE;
    }

    getNextPossibleSteps() {
        const lastPathField = this.player.getField();
        const neighborFields = lastPathField.getNeighbors();

        if (this.mode == RunAction.MODE_MOVE) {
            const emptyNeighbors = neighborFields.filter(n => ((n.isEmpty() || n.getGameObjects().filter(go => go instanceof Torque).length > 0) && n.isAccessible()));

            return emptyNeighbors;
        } else {
            return neighborFields;
        }
    }

    movePlayer(hex) {
        this.player.hex = hex;

        this.remainingSteps--;
        if (this.remainingSteps <= 0) {
            this.mode = RunAction.MODE_TURN;
        }
    }

    turnPlayer(hex) {
        const direction = Hex.isNeighborAt(this.player.hex, hex);
        if (direction != null) {
            this.player.direction = direction;
        } else {
            console.error("Can't turn player. Invalid direction");
        }
    }

    switchMode() {
        switch (this.mode) {
            case RunAction.MODE_MOVE:
                this.mode = RunAction.MODE_TURN;
                break;
            case RunAction.MODE_TURN:
                if (this.remainingSteps > 0) {
                    this.mode = RunAction.MODE_MOVE;
                }
                break;
        }
    }
}

RunAction.MAX_STEPS = 5;

RunAction.MODE_MOVE = "move";
RunAction.MODE_TURN = "turn";
