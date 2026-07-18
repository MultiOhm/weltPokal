const ctx = document.getElementById("eloChart");
const datasets = {};
fetch(CONFIG.BASE + "data/elo_history.csv")
    .then(r => r.text())
    .then(csv => {

        const rows = csv.trim().split(/\r?\n/);
        rows.shift(); // Kopfzeile entfernen

        const datasets = {};
        const leaderData = {};
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
                    pointHitRadius: 2,
                    pointRadius: 1,

                    pointHoverRadius: 8,

                    borderWidth: 2,

                    tension: 0.2

                };

            }

            datasets[team].data.push({

                x: tournament+stage+matchday,

                y: Number(elo),
                r:3

            });
            const day = tournament + stage + matchday;

            if(!leaderData[day]){
                leaderData[day] = [];
            }

            leaderData[day].push({
                team,
                elo:Number(elo)
            });


        });
        const bar = document.getElementById("leaderBar");

        Object.keys(leaderData).forEach(day=>{

            // nach Elo sortieren
            leaderData[day].sort((a,b)=>b.elo-a.elo);

            const maxElo = leaderData[day][0].elo;

            const leaders = leaderData[day].filter(t => t.elo === maxElo);

            const leader = leaders[0];

            const div = document.createElement("div");

            div.className = "leader-segment";

            div.style.background = teams[leader.team].primary;
            if (teams[leader.team].primary == "#000000")
            {
                div.style.background="#dddddd";
            }

            if (leaders.length > 1){
                div.classList.add("shared-leader");
            }
            div.title = leaders.map(l => l.team).join(" / ");      

            bar.appendChild(div);

        });
        console.log(Object.values(datasets));
        new Chart(ctx,{
            labels: [
                
            ],      
            type:"line",

            data:{

                datasets:Object.values(datasets)

            },
            options: {
                    interaction: {
                          mode: 'nearest'
                    },
                    plugins: {
                        legend: {
                            display: false
                            
                        }
                    }
                }
                    
        });

    });