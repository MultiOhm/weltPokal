window.tournaments = {};
window.tournamentsReady = fetch(CONFIG.BASE + "data/tournaments.csv")
    .then(r => r.text())
    .then(csv => {

        const rows = csv.trim().split("\n");
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