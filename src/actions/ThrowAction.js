class ThrowAction extends Action {
    constructor(gp, player) {
        super();

        this.gp = gp;
        this.player = player;

        this.possibleTargetFields = this.getPossibleTargets();
        this.targetField = null;
    }

    getPossibleTargets() {
        const playerField = this.player.getField();
        const boardFields = this.gp.layers.getBoardFields();
        const possibleTargetFields = boardFields.filter(f => {
            const go = f.getGameObjects()[0];
            if (go instanceof Player && go != this.player) {
                // team mate or opposing player
                return true;
            } else if (f.type == Field.TYPE_HOLE && f.strikeArea == playerField.strikeArea && f.teamSide == playerField.teamSide && f.isOpen == true) {
                // opposing open hole
                return true;
            } else {
                return false;
            }
        });
        const possibleTargetFieldsInRange = possibleTargetFields.filter(f => f.hex.rangeTo(playerField.hex) <= ThrowAction.MAX_RANGE);

        return possibleTargetFieldsInRange;
    }

    target(field) {
        if (field != null && this.possibleTargetFields.indexOf(field) != -1) {
            console.log("targeted");
            this.targetField = field;
        }
    }

    throwTorque() {
        // spawn torque in target field
        if (this.targetField != null) {
            const field = this.targetField;
            const hex = this.targetField.hex;
            const torque = new Torque(this.gp, new Hex(hex.q, hex.r));
            this.gp.addGameObject(torque);

            field.getGameObjects().forEach(go => {
                if (go instanceof Player) {
                    const targetPlayer = go;
                    if (true || targetPlayer.isTeamMateOf(this.player)) {
                        // pass torque
                        targetPlayer.pickUpTorque();
                    } else {
                        // hit opposing player
                        // targetPlayer.bash();
                        torque.scatter();
                    }
                }
            });

            // reset action's target field
            this.targetField = null;

            this.player.throwTorque();
        } else {
            console.log("Can't throw torque. No target selected");
        }
    }
}
ThrowAction.MAX_RANGE = 9;
