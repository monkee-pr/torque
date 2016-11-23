class RunAction extends Action {
    constructor(gp, player) {
        super();

        this.gp = gp;
        this.player = player;
        this.hexPath = [];
        this.addHexToPath(player.hex);

        this.getNextPossibleSteps();

    }

    addHexToPath(hex) {
        const path = this.hexPath;
        if (path.length < RunAction.MAX_PATH_LENGTH) {

            const index = path.map(h => h.equals(hex)).indexOf(true);
            if (index != -1) {
                path.splice(index);
            }
            path.push(hex);
        } else {
            return false;
        }

        if (path.length == RunAction.MAX_PATH_LENGTH) {
            this.finish(this.gp.cancelAction());
        }

        return true;
    }

    getNextPossibleSteps() {
        const player = this.player;
        const playerField = this.gp.layers.getBoardFields().filter(f => f.hex.equals(player.hex))[0];
        const neighborFields = playerField.getNeighbors();
        const emptyNeighbors = neighborFields.filter(n => n.isEmpty(this.gp));

        return emptyNeighbors;
    }
}
RunAction.MAX_PATH_LENGTH = 1 + 5;  // including the start hex
