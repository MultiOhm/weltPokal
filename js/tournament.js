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
        "Sieger: "+tournaments[tournament].winner
        document.getElementById("tournamentSecond").textContent =
        "Zweiter: "+tournaments[tournament].second
        document.getElementById("tournamentThird").textContent =
        "Dritter: "+tournaments[tournament].third
        document.getElementById("tournamentForth").textContent =
        "Vierter: "+tournaments[tournament].fourth
        
    
    
    });
});