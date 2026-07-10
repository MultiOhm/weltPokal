const parameters = new URLSearchParams(window.location.search);

const year = parameters.get("tournament");

const tournamentn = {
  rounds: [
    {
      name: "Achtelfinale",
      matches: [
        { id: 1, team1: "Sieger A", team2: "Team B", winner: null },
        { id: 2, team1: "Sieger C", team2: "Team D", winner: null },
        { id: 3, team1: "Sieger E", team2: "Team F", winner: null },
        { id: 4, team1: "Sieger G", team2: "Team H", winner: null },
        { id: 5, team1: "Sieger B", team2: "Team B", winner: null },
        { id: 6, team1: "Sieger D", team2: "Team D", winner: null },
        { id: 7, team1: "Sieger F", team2: "Team F", winner: null },
        { id: 8, team1: "Sieger H", team2: "Team H", winner: null }
      ]
    },
    {
      name: "Viertelfinale",
      matches: [
        { id: 9, team1: null, team2: null, winner: null },
        { id: 10, team1: null, team2: null, winner: null },
        { id: 11, team1: null, team2: null, winner: null },
        { id: 12, team1: null, team2: null, winner: null }
      ]
    },
    {
      name: "Halbfinale",
      matches: [
        { id: 13, team1: null, team2: null, winner: null },
        { id: 14, team1: null, team2: null, winner: null }
      ]
    },
    {
      name: "Finale",
      matches: [
        { id: 15, team1: null, team2: null, winner: null }
      ]
    }
  ]
};

function setWinner(roundIndex, matchIndex, winner) {
    const match = tournamentn.rounds[roundIndex].matches[matchIndex];
    match.winner = winner;

    if (roundIndex === tournamentn.rounds.length - 1) return;

    const nextMatch =
        tournamentn.rounds[roundIndex + 1].matches[Math.floor(matchIndex / 2)];

    if (matchIndex % 2 === 0) {
        nextMatch.team1 = winner;
    } else {
        nextMatch.team2 = winner;
    }
}
teamIndex = {}
loadteams = fetch(CONFIG.BASE + "data/teams.csv")
    .then(r => r.text())
    .then(csv => {
        console.log(CONFIG.BASE+"data/teams.csv"
        );
        
        const rows = csv.trim().split("\n");
        rows.shift();

        rows.forEach(row => {

            const [country, code, flag, primary, secondary, text] = row.split(",");

            teamIndex[country] = {
                country,
                code,
                flag,
                primary,
                secondary,
                text
            };
        });

    renderBracket();


    });

function renderBracket() {
    const bracket = document.getElementById("bracket");
    bracket.innerHTML = "";
    i = 1
    tournamentn.rounds.forEach(round => {

        const roundDiv = document.createElement("div");
        roundDiv.className = "round";


    
        round.matches.forEach(match => {

            const matchDiv = document.createElement("div");
            matchDiv.className = "match";
            matchDiv.id = "match"+i;
            i++;
            if (teamIndex[match.team1])
            {
                matchDiv.innerHTML = `
                    <div><img src="../flags/${teamIndex[match.team1].flag}.png" style="height:12px"><a>${match.team1 ?? "-"}</a></div>
                    <div>${match.team2 ?? "-"}</div>
                `;
            }
            else
            {
                matchDiv.innerHTML = `
                    <div><a>${match.team1 ?? "-"}</a></div>
                    <div>${match.team2 ?? "-"}</div>
                `;
            }
            roundDiv.appendChild(matchDiv);
        });

        bracket.appendChild(roundDiv);
    });
}


function connectMatches(matchA, matchB, nextMatch){

    const svg = document.getElementById("lines");
    const svgRect = svg.getBoundingClientRect();

    function getPoint(el, side = "right") {
        const r = el.getBoundingClientRect();

        return {
            x: (side === "right" ? r.right : r.left) - svgRect.left,
            y: r.top + r.height / 2 - svgRect.top
        };
    }

    const a = getPoint(matchA, "right");
    const b = getPoint(matchB, "right");
    const n = getPoint(nextMatch, "left");

    const middleX = (a.x + n.x) / 2;

    // 👉 Linie zeichnen
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    // =========================================
    // ⭐ DAS IST DEIN WICHTIGER TEIL
    // nextMatch zentrieren zwischen A und B
    // =========================================

    const centerY = (a.y + b.y) / 2 - 35;

    nextMatch.style.position = "absolute";
    nextMatch.style.top = centerY + "px";
    const nn = getPoint(nextMatch, "left");

    path.setAttribute("d", `
        M ${a.x} ${a.y}
        H ${middleX}
        V ${b.y}
        H ${b.x}

        M ${middleX} ${a.y}
        V ${b.y}

        M ${middleX} ${nn.y}
        H ${nn.x}
    `);

    path.setAttribute("stroke", "#fff");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    
    svg.append(path);


}

function getCenterY(el, svgRect){
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2 - svgRect.top;
}

function connectAll()
{
    connectMatches(
        document.getElementById("match1"),
        document.getElementById("match2"),
        document.getElementById("match9")
    );
    connectMatches(
        document.getElementById("match3"),
        document.getElementById("match4"),
        document.getElementById("match10")
    );
    connectMatches(
        document.getElementById("match5"),
        document.getElementById("match6"),
        document.getElementById("match11")
    );
    connectMatches(
        document.getElementById("match7"),
        document.getElementById("match8"),
        document.getElementById("match12")
    );

    connectMatches(
        document.getElementById("match9"),
        document.getElementById("match10"),
        document.getElementById("match13")
    );
    connectMatches(
        document.getElementById("match11"),
        document.getElementById("match12"),
        document.getElementById("match14")
    );
    connectMatches(
        document.getElementById("match13"),
        document.getElementById("match14"),
        document.getElementById("match15")
    );
}


function setupAutoRedraw(){

    const container = document.getElementById("bracket-container");

    const observer = new ResizeObserver(() => {

        // verhindert „glitch spam“
        window.requestAnimationFrame(() => {
            redraw();
        });

    });

    observer.observe(container);
}

setupAutoRedraw();

function redraw(){

    const svg = document.getElementById("lines");
    svg.innerHTML = "";

    requestAnimationFrame(() => {
        connectAll();
    });
}