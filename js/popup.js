const popup = document.getElementById("match-popup");

document.querySelector(".match-card").onclick = function(){
    alert("Karte geklickt");
};

document.querySelectorAll(".match-card").forEach(card => {


    card.addEventListener("click",()=>{


        document.getElementById("popup-home").textContent =
            card.dataset.home;


        document.getElementById("popup-away").textContent =
            card.dataset.away;


        document.getElementById("popup-score").textContent =
            card.dataset.homeScore 
            + ":" +
            card.dataset.awayScore;


        document.getElementById("popup-stadium").textContent =
            card.dataset.stadium;


        popup.classList.add("active");


    });


});


document.querySelector(".close-popup")
.addEventListener("click",()=>{

    popup.classList.remove("active");

});