const ctx = document.getElementById("eloChart");
const datasets = {};
fetch(CONFIG.BASE + "data/elo_history.csv")
    .then(r => r.text())
    .then(csv => {

        const rows = csv.trim().split(/\r?\n/);
        rows.shift(); // Kopfzeile entfernen

        const datasets = {};

        rows.forEach(row => {

            const [
                snapshot,
                tournament,
                stage,
                matchday,
                team,
                rank,
                elo
            ] = row.split(",");

            if (!datasets[team]) {

                const info = teams[team];
                color = info.primary;
                if (color == "#000000")
                {
                    color = "#ffffff"
                }
                datasets[team] = {

                    label: team,

                    data: [],
                    
                    borderColor: color,

                    backgroundColor: color,
                    pointHitRadius: 15,
                    pointRadius: 1,

                    pointHoverRadius: 8,

                    borderWidth: 2,

                    tension: 0.2

                };

            }

            datasets[team].data.push({

                x: tournament+stage+matchday,

                y: Number(elo)

            });


        });

        console.log(Object.values(datasets));
        new Chart(ctx,{
            labels: [
                
            ],      
            type:"line",

            data:{

                datasets:Object.values(datasets)

            },
        

        });

    });