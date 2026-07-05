document.addEventListener("DOMContentLoaded", () => {

    let selectedCountry = "all";
    let selectedYear = "all";
    let selectedType = "all";

    // -----------------------
    // Länder
    // -----------------------

    document.querySelectorAll(".flag-btn").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".flag-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            selectedCountry = button.dataset.country;

            filterCards();

        });

    });

    // -----------------------
    // Turniere
    // -----------------------

    document.querySelectorAll(".year-btn").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".year-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            selectedYear = button.dataset.year;

            filterCards();

        });

    });

    // -----------------------
    // Trikottyp
    // -----------------------

    document.querySelectorAll(".type-btn").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".type-btn")
                .forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            selectedType = button.dataset.type;

            filterCards();

        });

    });

    // -----------------------
    // Filterfunktion
    // -----------------------

    function filterCards() {

        const cards = document.querySelectorAll(".kit-card");

        let visible = 0;

        cards.forEach(card => {

            let show = true;

            if (
                selectedCountry !== "all" &&
                card.dataset.country !== selectedCountry
            ) {
                show = false;
            }

            if (
                selectedYear !== "all" &&
                card.dataset.year !== selectedYear
            ) {
                show = false;
            }

            if (
                selectedType !== "all" &&
                card.dataset.type !== selectedType
            ) {
                show = false;
            }

            if (show) {

                card.style.display = "";

                visible++;

            } else {

                card.style.display = "none";

            }

        });

        updateCounter(visible);

    }

    // -----------------------
    // Zähler
    // -----------------------

    function updateCounter(count) {

        const counter = document.getElementById("result-count");

        if (!counter) return;

        if (count === 1) {

            counter.textContent = "1 Trikot gefunden";

        } else {

            counter.textContent = count + " Trikots gefunden";

        }

    }

    // -----------------------
    // Initial
    // -----------------------

    filterCards();

});



window.teamsReady.then(() => {

    fetch(CONFIG.BASE + "data/generated/kitcards.html")
        .then(r => r.text())
        .then(html => {

            const gallery = document.getElementById("gallery");
            if (!gallery) return;

            // 🧠 1. HTML parsen (isoliert)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // 🧠 2. Karten holen
            let cards = Array.from(doc.querySelectorAll(".kit-card"));

            // 🧠 3. ALPHABETISCH SORTIEREN
            cards.sort((a, b) => {
                const aVal = (a.dataset.country || "").toLowerCase();
                const bVal = (b.dataset.country || "").toLowerCase();
                const countryCompare = aVal.localeCompare(bVal);          
                if (countryCompare !== 0) {
                    return countryCompare;
                }

        // dann nach Jahr
                const yearA = parseInt(a.dataset.year) || 0;
                const yearB = parseInt(b.dataset.year) || 0;
                return yearA - yearB;
            });

            // 🧠 4. Rendern
            gallery.innerHTML = "";
            cards.forEach(card => gallery.appendChild(card));

            // 🧠 5. Farben setzen
            gallery.querySelectorAll(".kit-card").forEach(card => {

                const team = window.teams[card.dataset.team];

                if (!team) {
                    console.warn("Team nicht gefunden:", card.dataset.team);
                    return;
                }

                card.style.setProperty("--accent", team.primary);
                card.style.setProperty("--accentfont", team.secondary);
            });

            // 🧠 6. Filter anwenden
            filterCards();

            console.log("First kitcard:", cards[0]?.outerHTML);
        });
});