const params=new URLSearchParams(window.location.search);

const teamId=params.get("team");

const currentTournament="2025"
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



});


function loadMatches(teamId){

    fetch(CONFIG.BASE+"matchcards.html")

    .then(r=>r.text())

    .then(html=>{

        const parser=new DOMParser();

        const doc=parser.parseFromString(html,"text/html");

        const cards=[...doc.querySelectorAll(".match-card")];

        const container=document.getElementById("recentMatches");

        container.innerHTML="";

        cards.forEach(card=>{
            const correctTournament =
                selectedTournament === "all" ||
                card.dataset.tournament === selectedTournament;
            const correctTeam =
                card.dataset.home===teamId ||
                card.dataset.away===teamId;

            if(correctTeam && correctTournament){

                const home=window.teams[card.dataset.home];
                const away=window.teams[card.dataset.away];

                card.style.setProperty("--home-color",home.primary);
                card.style.setProperty("--home-secondary",home.secondary);
                card.style.setProperty("--home-text",home.text);

                card.style.setProperty("--away-color",away.primary);
                card.style.setProperty("--away-secondary",away.secondary);
                card.style.setProperty("--away-text",away.text);

                container.appendChild(card);

            }

        });

    });

}

let selectedTournament = null;

window.tournamentsReady.then(() => {

    const filter = document.getElementById("tournamentFilter");

    const years = Object.keys(window.tournaments)
        .sort((a,b)=>a-b);

    selectedTournament = years[5]; // neuestes

    years.forEach(year=>{

        const button = document.createElement("button");

        button.textContent = year;

        button.dataset.year = year;

        if(year===selectedTournament){

            button.classList.add("active");

        }

        button.onclick = ()=>{

            selectedTournament = year;

            filter.querySelectorAll("button")
                .forEach(btn=>btn.classList.remove("active"));

            button.classList.add("active");
            console.log(selectedTournament);

            loadMatches(teamId);

        };

        filter.appendChild(button);

    });
    const all = document.createElement("button");

    all.textContent = "Alle";
    all.dataset.year = "all";

    all.onclick = ()=>{

        selectedTournament = "all";

        filter.querySelectorAll("button")
            .forEach(btn=>btn.classList.remove("active"));

        all.classList.add("active");

        loadMatches(teamId);

    };

    filter.appendChild(all);

    loadMatches(teamId);

});


let currentKit = 0;

let kitCards = [];



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



let elo = {};

fetch(CONFIG.BASE + "../data/elo.json")
    .then(r => r.json())
    .then(data => {

        elo = data;
        
        document.getElementById("teamElo").textContent = "Elo: "+elo[teamId].elo + " ("+elo[teamId].rank+")";

    });



      var swiper = new Swiper('.mySwiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 10,
          stretch: 0,
          depth: 50,
          modifier: 1,
        },
        pagination: {
          el: '.swiper-pagination',
        },
    });
    fetch(CONFIG.BASE + "data/kits.json")
    .then(r => r.json())
    .then(files => {
        files.sort((a, b) => {

            function parse(file){

                const name = file.replace(".png","");

                return {

                    code: name.substring(0,3),

                    type: name.substring(3,name.length-2),

                    year: parseInt(name.slice(-2))

                };

            }

            function getTypeOrder(type){

                if(type === "h") return 0;
                if(type === "a") return 1;
                if(type === "t") return 2;

                // g1, g2, g3 ...
                const keeper = type.match(/^g(\d+)$/);

                if(keeper){
                    return 3 + parseInt(keeper[1]);
                }

                // aktuelles gk
                if(type === "gk") return 3;

                return 999;

            }

            const A = parse(a);
            const B = parse(b);

            if(A.code !== B.code){

                return A.code.localeCompare(B.code);

            }

            if(A.year !== B.year){

                return A.year - B.year;

            }

            return getTypeOrder(A.type) - getTypeOrder(B.type);

        });

        files.forEach(file => {
            flag = ""
            const match = file.match(
                /^([A-Za-z]{3})(g\d+|gk|h|a|t)(\d{2})\.png$/
            );            countryname = "";
            if (!match) return;
            
            for (t in window.teams)
            {
                
                
                if (teams[t].code == match[1].toUpperCase())
                {
                    countryname = t;
                    
                    flag = teams[t].flag;
                    console.log("YO"+flag);
                    

                }
            }
            if (countryname == teamId){
                const [
                    ,
                    code,
                    type,
                    year
                ] = match;


                const country = code;


                let kitType;

                switch(type) {
                    case "h":
                        kitType = "Home";
                        break;

                    case "a":
                        kitType = "Away";
                        break;

                    case "t":
                        kitType = "Third";
                        break;

                    case "gk":
                        kitType = "Goalkeeper";
                        break;
                }


                const slide = document.createElement("div");

                slide.className = "swiper-slide";


                slide.innerHTML = `

                <div class="kit-panini">
                    <div class="card-box">
                        <div class="frame-box">
                            <div class="frame">
                                <div class="flag">
                                    <img src="flags/${flag}.png" id="flag">
                                </div>

                                <div class="top">
                                    <div class="year" id="year">20${year}</div>
                                    
                                </div>

                                <div class="render" id="render">
                                    <img src="renders/${file}">
                                </div>
                            </div>
                        </div>

                        <div class="bottom">

                            <div class="country" id="country">${countryname}</div>

                            <div class="type" id="type">HOME</div>


                        </div>
                    </div>
                </div>

                `;
                swip = document.getElementById("wrapper");
                if ("20"+year != "2020")
                {swip.appendChild(slide);

                }

                if ("20"+year == currentTournament)
                {
                    const fig = document.createElement("figure");
                    fig.innerHTML = `<img src="renders/${file}" alt="${kitType}">
                        <figcaption>${kitType}</figcaption>

                    `;
                    
                    let timeout;

                    fig.addEventListener("mouseenter", () => {

                        clearTimeout(timeout);

                        fig.style.zIndex = 99;

                    });

                    fig.addEventListener("mouseleave", () => {

                        timeout = setTimeout(() => {

                            fig.style.zIndex = 0;

                        },250);

                    });                    
                    gal = document.getElementById("galleryTest");
                    gal.appendChild(fig);
                }
            }



        });

    });    
        


cards.forEach(card => {
    console.log("LOF");
    
    card.addEventListener("mouseenter", () => {
        console.log("YO");
        
        card.style.zIndex = 99;
    });

    card.addEventListener("mouseleave", () => {

        setTimeout(() => {
            console.log("DIGGER");
            
            card.style.zIndex = 0;
        }, 250);   // Dauer der Scale-Animation

    });

});