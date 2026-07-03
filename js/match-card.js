window.teamsReady.then(() => {

    fetch(CONFIG.BASE + "data/generated/matchcards.html")
        .then(r => r.text())
        .then(html => {

            const track = document.getElementById("matchesTrack");
            if (!track) return;

            track.innerHTML = html;

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