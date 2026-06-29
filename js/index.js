const track = document.getElementById("matchesTrack");
const wrapper = document.querySelector(".matches-wrapper");

const prev = document.getElementById("prevMatch");
const next = document.getElementById("nextMatch");

let position = 0;

function getCardWidth() {

    const card = document.querySelector(".match-card");

    if (!card) return 0;

    const gap = 30; // entspricht gap im CSS

    return card.offsetWidth + gap;

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

fetch("tools/matchcards.html")
    .then(response => response.text())
    .then(html => {

        document.getElementById("matchesTrack").innerHTML = html;

        console.log(document.querySelector(".match-card").outerHTML);

        filterCards();

    });