const popup = document.getElementById("match-popup");

document.querySelector(".match-card").onclick = function(){
    alert("Karte geklickt");
};



document.querySelector(".close-popup")
.addEventListener("click",()=>{

    popup.classList.remove("active");

});