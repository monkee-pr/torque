class BashAction extends Action {
    constructor(gp, player) {
        super();

        this.gp = gp;
        this.player = player;

        this.possibleTargets = this.getPossibleTargets();
        this.targetPlayer = null;
    }

    getPossibleTargets() {
        const playerField = this.player.getField();
        const threadZone = this.player.getThreadZone();
        const possibleTargets = threadZone.map(f => {
            const go = f.getGameObjects()[0];
            if (go instanceof Player) {
                // team mate or opposing player
                if (go.isTeamMateOf(this.player)) {
                    // can't bash team mates
                    return null;
                } else {
                    // opposing player

                    // consider bashed players here

                    return go;
                }
            } else {
                return null;
            }
        }).filter(go => go instanceof Player);

        return possibleTargets;
    }

    target(player) {
        const x = this.possibleTargets.indexOf(player);
        if (player != null && this.possibleTargets.indexOf(player) != -1) {
            this.targetPlayer = player;
            console.log("target");
            console.log(player);
        }
    }

    bash() {
        // spawn torque in target field
        if (this.targetPlayer != null) {
            const target = this.targetPlayer;
            const player = this.player;

            player.bash(target);
        } else {
            console.log("Can't bash. No target selected");
        }
    }
}
ThrowAction.MAX_RANGE = 9;
