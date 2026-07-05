const params=new URLSearchParams(window.location.search);

const teamId=params.get("team");

const currentTournament="2015"
teamsReady.then(()=>{

    const team=teams[teamId];

    if(!team){

        document.body.innerHTML="<h1>Team nicht gefunden.</h1>";

        return;

    }
    
    document.title=team.country+" | weltPokal";

    document.getElementById("teamName").textContent=team.country;

    document.getElementById("teamFlag").src=
        CONFIG.BASE+"flags/"+team.flag+".png";


    document.documentElement.style.setProperty(
        "--primary",
        team.primary
    );

    document.documentElement.style.setProperty(
        "--secondary",
        team.secondary
    );

    document.documentElement.style.setProperty(
        "--teamtext",
        team.text

    );




    loadHistory(team);
    loadMatches(team);

    loadKits(team);


});

function loadMatches(team){

    fetch(CONFIG.BASE+"matchcards.html")

    .then(r=>r.text())

    .then(html=>{

        const parser=new DOMParser();

        const doc=parser.parseFromString(html,"text/html");

        const cards=[

            ...doc.querySelectorAll(".match-card")

        ];
        

        const container=document.getElementById("recentMatches");

        cards.forEach(card=>{

            if(

                (card.dataset.home===teamId ||

                card.dataset.away===teamId) // && card.dataset.tournament===currentTournament

            ){

                container.appendChild(card);

            }
             document.querySelectorAll(".match-card").forEach(card => {

                const home = window.teams[card.dataset.home];
                const away = window.teams[card.dataset.away];

                if (!home || !away) return;

                card.style.setProperty("--home-color", home.primary);
                card.style.setProperty("--home-secondary", home.secondary);
                card.style.setProperty("--home-text", home.text);

                card.style.setProperty("--away-color", away.primary);
                card.style.setProperty("--away-secondary", away.secondary);
                card.style.setProperty("--away-text", away.text);
            });


        });

    });

}

function loadKits(team){

    fetch(CONFIG.BASE + "data/generated/kitcards.html")

    .then(r => r.text())

    .then(html => {

        const parser = new DOMParser();

        const doc = parser.parseFromString(html,"text/html");

        const kits = [...doc.querySelectorAll(".kit-card")];

        const track = document.getElementById("kit-track");

        track.innerHTML = "";

        kits

        .filter(card =>

            card.dataset.team === teamId && card.dataset.year != 2020

        )

        .sort((a,b)=>

            parseInt(a.dataset.year)-parseInt(b.dataset.year)

        )

        .forEach(card=>{

            track.appendChild(card);

        });

    });

}
function loadHistory(team){

    fetch(CONFIG.BASE+"data/history.csv")

    .then(r=>r.text())

    .then(csv=>{

        const rows=csv.trim().split("\n");

        rows.shift();

        const container=document.getElementById("history");
        console.log(container);
        
        rows.forEach(row => {

            const [country, year, result] = row.trim().split(",");

            if(country !== teamId) return;

            let dotClass = "";

            switch(result){

                case "Sieger":
                    dotClass = "winner";
                    break;

                case "Zweiter": 
                    dotClass = "final";
                    break;

                case "Dritter":
                    dotClass = "third";
                    break;
                
                case "Vierter":
                    dotClass = "forth";
                    break;

                case "Viertelfinale":
                    dotClass = "quarter";
                    break;

                 case "Achtelfinale":
                    dotClass = "round16";
                    break;

                case "N.Q.":
                    dotClass = "nq";
                    break;

                default:
                    dotClass = "group";

            }

            container.innerHTML += `

                <div class="history-event">

                    <div class="history-dot ${dotClass}"></div>

                    <div class="history-year">${year}</div>

                    <div class="history-result">${result}</div>

                </div>

            `;

        });
    const history = document.getElementById("history");

    const left =
        first.getBoundingClientRect().left -
        history.getBoundingClientRect().left +
        first.offsetWidth/2;

    const right =
        last.getBoundingClientRect().left -
        history.getBoundingClientRect().left +
        last.offsetWidth/2;
    const line = document.querySelector(".history-line");

    const first = document.querySelector(".history-event:first-child .history-dot");
    const last  = document.querySelector(".history-event:last-child .history-dot");

    if(!first || !last){
        return;
    }
    if(first && last){

        const left =
            first.offsetLeft + first.offsetWidth/2;

        const right =
            last.offsetLeft + last.offsetWidth/2;

        line.style.left = left + "px";
        line.style.width = (right-left) + "px";

    }     
    });


}


function loadStatistics(team){

    let games=0;

    let goals=0;

    let wins=0;

    let draws=0;

    let losses=0;


}

const track = document.getElementById("kit-track");

document.querySelector(".prev").onclick = () => {

    track.scrollBy({

        left:-150,

        behavior:"smooth"

    });

};

document.querySelector(".next").onclick = () => {

    track.scrollBy({

        left:150,

        behavior:"smooth"

    });

};
let isDragging = false;
let moved = false;

let startX = 5;
let scrollLeft = 0;

const threshold = 20;

const slider = document.querySelector(".kit-track");


