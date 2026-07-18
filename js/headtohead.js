let selectedLeft = null;
let selectedRight = null;

let currentSide = null;

let headtohead = {};


let elo = {};

fetch(CONFIG.BASE + "data/elo.json")
    .then(r => r.json())
    .then(data => {

        elo = data;

    });



document.getElementById("selectLeft").onclick=()=>{

    currentSide="left";

    openSelector();

};

document.getElementById("selectRight").onclick=()=>{

    currentSide="right";

    openSelector();

};


fetch(CONFIG.BASE + "data/headtohead.csv")
.then(r => r.text())
.then(csv => {

    const rows = csv.trim().split("\n");

    rows.shift(); // Kopfzeile entfernen

    rows.forEach(row => {

        const [
            games,
            team1,
            team2,
            wins1,
            draws,
            wins2,
            goals1,
            goals2,
            first,
            last
        ] = row.split(",");

        const key = [team1, team2].sort().join("|");

        headtohead[key] = {
            games,

            team1,
            team2,

            wins1: Number(wins1),
            draws: Number(draws),
            wins2: Number(wins2),

            goals1: Number(goals1),
            goals2: Number(goals2),

            first,
            last

        };

    });

});

function openSelector(){

    document.getElementById("teamSelector").classList.remove("hidden");

    const list=document.getElementById("teamList");

    list.innerHTML="";

    Object.values(window.teams)

    .sort((a,b)=>a.country.localeCompare(b.country))

    .forEach(team=>{

        list.innerHTML+=`

        <div class="team-option"

             onclick="chooseTeam('${team.country}')">

            <img src="${CONFIG.BASE}flags/${team.flag}.png">

            ${team.country}

        </div>

        `;

    });

}

function chooseTeam(country){

    document.getElementById("teamSelector").classList.add("hidden");

    if(currentSide==="left"){

        selectedLeft=country;

        loadPanel(country,"left");

    }

    else{

        selectedRight=country;

        loadPanel(country,"right");

    }

    if(selectedLeft && selectedRight){

        loadHeadToHead();
        loadMatchHistory(selectedLeft,selectedRight);

    }

}

function loadPanel(country,side){

    const team=window.teams[country];

    document.getElementById(side+"Country").textContent=team.country;

    document.getElementById(side+"Flag").src=

        CONFIG.BASE+"flags/"+team.flag+".png";

    document.getElementById("team"+side.charAt(0).toUpperCase()+side.slice(1))
        .style.background=team.primary;

    document.getElementById("team"+side.charAt(0).toUpperCase()+side.slice(1))
        .style.color=team.text;

    document.getElementById(side+"Elo").textContent=elo[country].elo;

}

function loadHeadToHead(){

    const key=[selectedLeft,selectedRight].sort().join("|");
    console.log(headtohead);
    
    const h=headtohead[key];

    const box=document.getElementById("headtoheadResult");

    if(!h){

        box.classList.remove("hidden");

        document.getElementById("resultTitle").textContent="Keine Begegnungen";

        document.getElementById("wins1").textContent="-";
        document.getElementById("wins2").textContent="-";
        document.getElementById("draws").textContent="-";

        document.getElementById("games").textContent="-";
        document.getElementById("goals").textContent="-";
        document.getElementById("first").textContent="-";
        document.getElementById("last").textContent="-";

        return;

    }

    let winsLeft;
    let winsRight;
    let goalsLeft;
    let goalsRight;
    
    if(h.team1===selectedLeft){

        winsLeft=h.wins1;
        winsRight=h.wins2;

        goalsLeft=h.goals1;
        goalsRight=h.goals2;

    }

    else{

        winsLeft=h.wins2;
        winsRight=h.wins1;

        goalsLeft=h.goals2;
        goalsRight=h.goals1;

    }

    box.classList.remove("hidden");

    document.getElementById("wins1").textContent=winsLeft;

    document.getElementById("wins2").textContent=winsRight;

    document.getElementById("draws").textContent=h.draws;

    document.getElementById("games").textContent=h.games;

    document.getElementById("goals").textContent=

        `${goalsLeft} : ${goalsRight}`;

    document.getElementById("first").textContent=h.first;

    document.getElementById("last").textContent=h.last;

}

document.getElementById("teamSearch").addEventListener("input",e=>{

    const text=e.target.value.toLowerCase();

    document.querySelectorAll(".team-option").forEach(o=>{

        o.style.display=

            o.textContent.toLowerCase().includes(text)

            ? "flex"

            : "none";

    });

});

async function loadMatchHistory(team1, team2){

    const response = await fetch(
        CONFIG.BASE + "matchcards.html"
    );

    const html = await response.text();

    const parser = new DOMParser();

    const doc = parser.parseFromString(
        html,
        "text/html"
    );

    const cards = [
        ...doc.querySelectorAll(".match-card")
    ];

    const container =
        document.getElementById("matches");

    container.innerHTML = "";

    cards.forEach(card => {

        const home = card.dataset.home;
        const away = card.dataset.away;

        const correct =

            (
                home === team1 &&
                away === team2
            )

            ||

            (
                home === team2 &&
                away === team1
            );

        if(!correct){
            return;
        }

        card.style.setProperty("--home-color",teams[home].primary);
        card.style.setProperty("--home-secondary",teams[home].secondary);
        card.style.setProperty("--home-text",teams[home].text);

        card.style.setProperty("--away-color",teams[away].primary);
        card.style.setProperty("--away-secondary",teams[away].secondary);
        card.style.setProperty("--away-text",teams[away].text);

        container.appendChild(card);

    });

}