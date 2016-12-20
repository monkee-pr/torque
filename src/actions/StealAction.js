class StealAction extends Action {
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
            const go = f.getParticipatingObjects()[0];
            if (go instanceof Player) {
                // team mate or opposing player
                if (go.isTeamMateOf(this.player)) {
                    // can't steal from team mates
                    return null;
                } else {
                    // opposing player

                    return go.holdsTorque() ? go : null;
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
        }
    }

    steal() {
        // spawn torque in target field
        if (this.targetPlayer != null) {
            const target = this.targetPlayer;
            const player = this.player;

            player.steal(target);
        } else {
            console.log("Can't steal. No target selected");
        }
    }
}
