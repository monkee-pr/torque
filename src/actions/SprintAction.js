class SprintAction extends Action {
    constructor(gp, player) {
        super();

        this.gp = gp;
        this.player = player;
        this.path = [];
        this.remainingMoves = 10;
    }

    getNextPossibleSteps() {
        const lastPathField = this.player.getField();
        const neighborFields = lastPathField.getNeighbors();
        const emptyNeighbors = neighborFields.filter(n => ((n.isEmpty() || n.getGameObjects().filter(go => go instanceof Torque).length > 0) && n.isAccessible()));

        return emptyNeighbors;
    }

    movePlayer(hex) {
        const playerHex = this.player.hex;
        const playerDirection = this.player.direction;

        // if new hex is not in player's direction this step consumes more moves
        const consumingMoves = Hex.getNeighborAt(playerHex, playerDirection).equals(hex) ? 1 : 2;
        // get consuming moves method

        this.player.hex = hex;
        this.player.direction = playerDirection;

        this.remainingMoves = this.remainingMoves - consumingMoves;
        if (this.remainingMoves <= 0) {
            const actionControl = this.gp.getActionControl();
            actionControl.submit(this.gp);
        }
    }
}
RunAction.MAX_MOVES = 10;  // including the start hex
