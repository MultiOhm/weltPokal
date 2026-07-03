window.teamsReady.then(() => {
    console.log(teams);
    
    const container = document.getElementById("teams");

    Object.values(window.teams)
    .sort((a,b) => a.code.localeCompare(b.code))
    .forEach(team => {
        console.log(team.code);
        
        container.innerHTML += `

        <a class="team-card" href="team.html?team=${team.country}" style="background-color:${team.primary}">
            <img src="${CONFIG.BASE}flags/${team.flag}.png"><br>

            <span class="team-name" style="color:${team.text}">

                ${team.code}

            </span>


        </a>

        `;

    });

});