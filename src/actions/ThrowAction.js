class ThrowAction extends Action {
    constructor(gp, player) {
        super();

        this.gp = gp;
        this.player = player;
    }

    getPossibleTargets() {
        const playerField = this.player.getField();
        const boardFields = this.gp.layers.getBoardFields();
        const possibleTargetFields = boardFields.filter(f => f.getGameObject() instanceof Player || (f.type == Field.TYPE_HOLE && f.strikeArea == playerField.strikeArea && f.teamSide == playerField.teamSide));
        const possibleTargetFieldsInRange = possibleTargetFields.filter(f => f.hex.rangeTo(playerField.hex) <= ThrowAction.MAX_RANGE);

        return possibleTargetFieldsInRange;
    }
}
ThrowAction.MAX_RANGE;
