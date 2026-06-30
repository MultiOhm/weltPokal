fetch("../tools/matchcards.html")
.then(response => response.text())
.then(html => {

    document.getElementById("groupMatches").innerHTML = html;

    setTimeout(() => {

        updateSlider();

    }, 50);

});