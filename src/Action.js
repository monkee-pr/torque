class Action {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
}
Action.TYPE_RUN = "run";
Action.TYPE_THROW = "throw";
Action.TYPE_DASH = "dash";
