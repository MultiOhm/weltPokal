window.teams = {};
window.teamsReady = fetch(CONFIG.BASE + "data/teams.csv")
    .then(r => r.text())
    .then(csv => {

        const rows = csv.trim().split("\n");
        rows.shift();

        rows.forEach(row => {

            const [country, code, flag, primary, secondary, text] = row.split(",");

            window.teams[country] = {
                country,
                code,
                flag,
                primary,
                secondary,
                text
            };
        });
    });