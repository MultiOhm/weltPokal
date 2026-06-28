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