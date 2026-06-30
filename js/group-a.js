// ----------------------------------------
// URL-Parameter
// ----------------------------------------

const params = new URLSearchParams(window.location.search);

const year = params.get("year");
const group = params.get("group");

// ----------------------------------------
// Titel setzen
// ----------------------------------------

document.title = `weltPokal ${year} | Gruppe ${group}`;

document.getElementById("tournament-title").textContent =
    `weltPokal ${year}`;

document.getElementById("group-title").textContent =
    `Gruppe ${group}`;

// ----------------------------------------
// Matchcards laden
// ----------------------------------------

fetch(CONFIG.BASE + "data/generated/matchcards.html")

.then(response => response.text())

.then(html => {

    const temp = document.createElement("div");

    temp.innerHTML = html;

    const container = document.getElementById("groupMatches");

    container.innerHTML = "";

    temp.querySelectorAll(".match-card").forEach(card => {

        if (

            card.dataset.tournament === year &&
            card.dataset.group === group

        ) {

            container.appendChild(card);

        }

    });

});

fetch(CONFIG.BASE + "data/"+year+"/"+group+"/standings.html")

.then(response => response.text())

.then(html => {

    const container = document.getElementById("groupStandings");


    container.innerHTML= html

    

});


// ----------------------------------------
// Popup öffnen
// ----------------------------------------

document.addEventListener("click", function (e) {

    const card = e.target.closest(".match-card");

    if (!card) return;

    const popup = document.getElementById("match-popup");

    document.getElementById("popup-home").textContent =
        card.dataset.home;

    document.getElementById("popup-away").textContent =
        card.dataset.away;

    document.getElementById("popup-score").textContent =
        card.dataset.score;

    document.getElementById("popup-stadium").textContent =
        card.dataset.stadium;

    document.getElementById("popup-away-img").src =
        "../../flags/" + card.dataset.flagaway + ".png";

    popup.style.display = "flex";

});

// ----------------------------------------
// Popup schließen
// ----------------------------------------

document.querySelector(".close-popup").addEventListener("click", () => {

    document.getElementById("match-popup").style.display = "none";

});

document.getElementById("match-popup").addEventListener("click", e => {

    if (e.target.id === "match-popup") {

        e.currentTarget.style.display = "none";

    }

});