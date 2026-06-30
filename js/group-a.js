fetch(CONFIG.BASE + "tools/matchcards.html")
.then(r=>r.text())
.then(html=>{

    document.getElementById("groupMatches").innerHTML=html;

});

document.addEventListener("click", function(e){

    const card = e.target.closest(".match-card");


    if(card){

        const popup = document.getElementById("match-popup");

        if(!popup) return;


        document.getElementById("popup-home").textContent =
            card.dataset.home;


        document.getElementById("popup-away").textContent =
            card.dataset.away;


        document.getElementById("popup-score").textContent =
            card.dataset.score;


        document.getElementById("popup-stadium").textContent =
            card.dataset.stadium;


        popup.style.display="flex";

    }



    if(e.target.classList.contains("close")){

        document.getElementById("match-popup").style.display="none";

    }

});

document.addEventListener("click", function(e){

    const popup = document.getElementById("match-popup");


    if(e.target === popup){

        popup.style.display="none";

    }

});