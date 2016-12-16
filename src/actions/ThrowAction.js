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
        const fieldsInScope = this.player.getScope();
        const possibleTargetFields = fieldsInScope.filter(f => {
            const go = f.getParticipatingObjects()[0];
            if (go instanceof Player && go != this.player) {
                // team mate or opposing player
                if (go.isTeamMateOf(this.player) && !go.canHoldTorque()) {
                    // friendly player that can't hold the torque
                    return false;
                } else {
                    // friendly player that can hold the torque, or opposing player
                    return true;
                }
            } else if (f.type == Field.TYPE_HOLE && f.strikeArea == playerField.strikeArea && f.teamSide == playerField.teamSide && f.isOpen == true) {
                // opposing open hole
                return true;
            } else {
                return false;
            }
        });
        const possibleTargetFieldsInRange = possibleTargetFields.filter(f => f.hex.distanceTo(playerField.hex) <= ThrowAction.MAX_RANGE);

        return possibleTargetFieldsInRange;
    }

    target(field) {
        if (field != null && this.possibleTargetFields.indexOf(field) != -1) {
            this.targetField = field;
        }
    }

    throwTorque() {
        // spawn torque in target field
        if (this.targetField != null) {
            const field = this.targetField;
            field.isTargeted = true;

            const currentHex = this.player.hex;
            const targetHex = field.hex;
            const torque = new Torque(this.gp, new Hex(currentHex.q, currentHex.r));
            this.gp.addParticipatingObject(torque);
            torque.addMovement(targetHex);

            // reset action's target field
            this.targetField = null;

            this.player.throwTorque();
        } else {
            console.log("Can't throw torque. No target selected");
        }
    }
}
ThrowAction.MAX_RANGE = 9;
