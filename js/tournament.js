// ----------------------------------------
// URL-Parameter
// ----------------------------------------

const params = new URLSearchParams(window.location.search);

const tournament = params.get("tournament");

// ----------------------------------------
// Titel setzen
// ----------------------------------------

document.title = `weltPokal ${tournament}`;

document.getElementById("tournamentName").textContent =
    `weltPokal ${tournament}`;

window.tournamentsReady.then(() => {
    document.getElementById("tournamentHost").textContent = 
    tournaments[tournament].host;

    window.teamsReady.then(() => {
        document.getElementById("tournamentFlag").src=
            CONFIG.BASE+"flags/"+teams[tournaments[tournament].host].flag+".png";
        document.getElementById("tournamentWinner").textContent =
        tournaments[tournament].winner;
        document.getElementById("tournamentSecond").textContent =
        tournaments[tournament].second;
        document.getElementById("tournamentThird").textContent =
        tournaments[tournament].third;
        document.getElementById("tournamentForth").textContent =
        tournaments[tournament].fourth;
        if (tournaments[tournament].winner)
        {
            document.getElementById("winnerFlag").src =
            CONFIG.BASE+"flags/"+teams[tournaments[tournament].winner].flag+".png";
            document.getElementById("secondFlag").src =
            CONFIG.BASE+"flags/"+teams[tournaments[tournament].second].flag+".png";
            document.getElementById("thirdFlag").src =
            CONFIG.BASE+"flags/"+teams[tournaments[tournament].third].flag+".png";
            document.getElementById("forthFlag").src =
            CONFIG.BASE+"flags/"+teams[tournaments[tournament].fourth].flag+".png";
        }
        window.groupsReady.then(() => {

        const container = document.querySelector(".group-grid");

        container.innerHTML = "";

        Object.entries(tournamentGroups[tournament]).forEach(([group,data]) => {

            container.innerHTML += `

            <div class="group-card">

                <a href="group.html?year=${tournament}&group=${group}">
                    <h3>Gruppe ${group}</h3>
                </a>

                ${teamLink(data.team1)}
                ${teamLink(data.team2)}
                ${teamLink(data.team3)}
                ${teamLink(data.team4)}

            </div>

            `;

        });

    });
        });
        
    });

function teamLink(name){
    console.log(name);
    
    return `

        <a class="group-card-team" href="team.html?team=${name}" style="--primary:${teams[name].primary};--text:${teams[name].text};">
            <img style="height:12px" src="../flags/${teams[name].flag}.png">
            ${teams[name].code}
        </a>

    `;

}