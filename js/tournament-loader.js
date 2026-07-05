window.tournaments = {};
window.tournamentsReady = fetch(CONFIG.BASE + "data/tournaments.csv")
    .then(r => r.text())
    .then(csv => {

        const rows = csv.trim().split(/\r?\n/);
        rows.shift();

        rows.forEach(row => {

            const [year,host,winner,second,third,fourth] = row.split(",");

            window.tournaments[year] = {
                year,
                host,
                winner,
                second,
                third,
                fourth
            };
        });
    });

window.tournamentGroups = {};
window.groupsReady = fetch(CONFIG.BASE + "data/groups.csv")
.then(r => r.text())
.then(csv => {

    const rows = csv.trim().split(/\r?\n/);
    rows.shift();

    rows.forEach(row => {

        const [year, group, team1, team2, team3, team4] = row.split(",");

        if(!window.tournamentGroups[year]){

            window.tournamentGroups[year] = {};

        }

        window.tournamentGroups[year][group] = {

            team1,
            team2,
            team3,
            team4

        };

    });

});