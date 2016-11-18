class Team {
    constructor(id) {
        this.id = id;

        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }
}
Team.TEAM_1 = 1;
Team.TEAM_2 = 2;
