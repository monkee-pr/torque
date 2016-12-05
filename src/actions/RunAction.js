class RunAction extends Action {
    constructor(gp, player) {
        super();

        this.gp = gp;
        this.player = player;
        this.path = [];
        this.addFieldToPath(player.getField());

        this.getNextPossibleSteps();

    }

    addFieldToPath(field) {
        // unhighlight all fields
        const boardFields = this.gp.layers.getBoardFields();
        boardFields.forEach(f => f.isHighlighted = false);

        const path = this.path;
        if (path.length < RunAction.MAX_PATH_LENGTH) {
            // add field to path
            const index = path.map(f => f.hex.equals(field.hex)).indexOf(true);
            if (index != -1) {
                path.splice(index);
            }
            path.push(field);

            if (path.length < RunAction.MAX_PATH_LENGTH) {
                // highlight next possible steps
                const nextPossibleSteps = this.getNextPossibleSteps();
                nextPossibleSteps.forEach(f => f.isHighlighted = true);
            }
            // else {
            //     // highlight next possible steps
            //     const nextPossibleSteps = this.getNextPossibleSteps().filter(f => path.indexOf(f) != -1);
            //     nextPossibleSteps.forEach(f => f.isHighlighted = true);
            // }

            return true
        } else {
            return false;
        }
    }

    getNextPossibleSteps() {
        const lastPathField = this.path[this.path.length-1];
        const neighborFields = lastPathField.getNeighbors();
        const emptyNeighbors = neighborFields.filter(n => (n.isEmpty() || n.getGameObjects().filter(go => go instanceof Torque).length > 0) && n.isAccessible());

        return emptyNeighbors;
    }

    movePlayer(hex) {
        this.player.hex = hex;
    }
}
RunAction.MAX_PATH_LENGTH = 1 + 5;  // including the start hex
