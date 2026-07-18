const track = document.getElementById("matchesTrack");
const wrapper = document.querySelector(".matches-wrapper");

const prev = document.getElementById("prevMatch");
const next = document.getElementById("nextMatch");

const dotsContainer = document.querySelector(".slider-dots");

let position = 0;

function getCardWidth() {

    const card = document.querySelector(".match-card");

    if (!card) return 0;

    const gap = 30; // entspricht gap im CSS

    return card.offsetWidth + gap;

}

function getTableWidth() {

    const table = document.querySelector(".table");

    if (!table) return 0;

    const gap = 30; // entspricht gap im CSS

    return table.offsetWidth + gap;

}


function updateButtons() {

    const maxScroll = Math.max(0, track.scrollWidth - wrapper.clientWidth);

    // Linker Pfeil
    if (position <= 0) {

        prev.disabled = true;

    } else {

        prev.disabled = false;

    }

    // Rechter Pfeil
    if (position >= maxScroll) {

        next.disabled = true;

    } else {

        next.disabled = false;

    }

}

function updateSlider() {

    track.style.transform = `translateX(-${position}px)`;

    updateButtons();

    updateDots();
}

next.addEventListener("click", () => {

    const maxScroll = Math.max(0, track.scrollWidth - wrapper.clientWidth);

    position += getCardWidth();

    if (position > maxScroll)
        position = maxScroll;

    updateSlider();

});

prev.addEventListener("click", () => {

    position -= getCardWidth();

    if (position < 0)
        position = 0;

    updateSlider();

});

// Falls das Fenster größer oder kleiner wird
window.addEventListener("resize", updateButtons);

// Beim Laden
updateSlider();
teamsReady.then(() => {

    console.log(teams)
    console.log(teams["Kolumbien"])

})


fetch(CONFIG.BASE + "data/2022/A/standings.html")
.then(response => response.text())
.then(html => {

    //document.getElementById("standingsTrack").innerHTML = html;

    setTimeout(() => {

        updateSlider();

    }, 50);

});


function createDots(){
    
    dotsContainer.innerHTML = "";
    
    const cards = document.querySelectorAll(".match-card");

    console.log(cards);
    
    
    cards.forEach((card,index)=>{

        const dot = document.createElement("span");

        dot.className = "dot";

        if(index===0){

            dot.classList.add("active");

        }
        dotsContainer.appendChild(dot);

        dot.addEventListener("click",()=>{

            position = index * getCardWidth();

            updateSlider();

        });


    });

}

function updateDots(){

    const dots = dotsContainer.querySelectorAll(".dot");

    const current = Math.round(position / getCardWidth());

    dots.forEach((dot,index)=>{

        dot.classList.toggle("active",index===current);

    });

}

window.teamsReady.then(() => {

    fetch(CONFIG.BASE + "matchcards.html")
        .then(r => r.text())
        .then(html => {

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const cards = [...doc.querySelectorAll(".match-card")];

            // Neuestes Turnier bestimmen
            const latestTournament = Math.max(
                ...cards.map(card => Number(card.dataset.tournament))
            );

            // Nur Spiele des neuesten Turniers
            const currentCards = cards.filter(card =>
                Number(card.dataset.tournament) === latestTournament
            );

            const track = document.getElementById("matchesTrack");
            if (!track) return;

            track.innerHTML = "";

            currentCards.slice(17,27).forEach(card => {

                track.appendChild(card);

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

            createDots();
            updateDots();

            setTimeout(updateSlider, 50);

        });

});

