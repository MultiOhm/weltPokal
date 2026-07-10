window.teamsReady.then(() => {
    fetch(CONFIG.BASE + "data/elo.csv")
    .then(r => r.text())
    .then(csv => {

        const rows = csv.trim().split(/\r?\n/);

        rows.shift(); // Header entfernen

        const body = document.getElementById("rankingBody");

        body.innerHTML = "";

        rows.forEach(row => {

            const [rank, team, elo] = row.split(",");

            const flag = teams[team].flag;

            body.innerHTML += `

                <tr class="ranking-line">

                    <td>${rank}</td>

                    <td>

                        <img src="${CONFIG.BASE}flags/${flag}.png"
                            style="height:12px;">
                    </td>
                    <td>
                        ${team}

                    </td>

                    <td>${elo}</td>

                </tr>

            `;

        });
    });
});
