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

window.teamsReady.then(() => {

    fetch(CONFIG.BASE + "data/generated/matchcards.html")
        .then(r => r.text())
        .then(html => {

            const track = document.getElementById("groupMatches");
            if (!track) return;

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const cards = Array.from(doc.querySelectorAll(".match-card"));

            // 👉 Beispiel: Filterwerte (kannst du dynamisch setzen!)
            const allowedGroup = group; // z. B. "A"

            const filtered = cards.filter(card => {

                const group = card.dataset.group;
                const stage = card.dataset.stage;

                return (!allowedGroup || group === allowedGroup);            });

            track.innerHTML = "";
            filtered.forEach(card => track.appendChild(card));

            // Farben setzen
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

            setTimeout(updateSlider, 50);
        });
});

fetch(CONFIG.BASE + "data/"+year+"/"+group+"/standings.html")

.then(response => response.text())

.then(html => {

    const container = document.getElementById("groupStandings");


    container.innerHTML= html

    

});


document.getElementById("groupTeams").textContent =
    findTeams(group);




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
        card.dataset.homegoals+":"+card.dataset.awaygoals;

    document.getElementById("popup-stadium").textContent =
        card.dataset.stadium+" in "+card.dataset.city;

    document.getElementById("popup-away-img").src =
        "../../flags/" + card.dataset.flagaway + ".png";

    document.getElementById("popup-home-img").src =
        "../../flags/" + card.dataset.flaghome + ".png";
    
    popup.style.display = "flex";

});

function findTeams(groupString)
{
    if (groupString == "A")
        return "Portugal - Algerien - Uruguay - Niederlande"
    if (groupString == "B")
        return "Brasilien - Nigeria - Iran - Kroatien"
    return "Teams Missing"
}

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

