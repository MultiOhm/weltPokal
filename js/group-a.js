fetch("../../tools/matchcards.html")
.then(r=>r.text())
.then(html=>{

    document.getElementById("groupMatches").innerHTML=html;

});