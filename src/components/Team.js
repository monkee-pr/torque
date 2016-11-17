class Team {
    constructor(id) {
        this.id = id;

        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }
}
Team.TEAM_1 = "team_1";
Team.TEAM_2 = "team_2";
