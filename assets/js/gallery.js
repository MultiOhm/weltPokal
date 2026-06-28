let selectedCountry = "all";
let selectedYear = "all";
let selectedType = "all";

document.querySelectorAll(".flag-btn").forEach(button=>{

    button.onclick=()=>{

        document.querySelectorAll(".flag-btn")
            .forEach(b=>b.classList.remove("active"));

        button.classList.add("active");

        selectedCountry=button.dataset.country;

        filterCards();

    }

});

document.querySelectorAll(".year-btn").forEach(button=>{

    button.onclick=()=>{

        document.querySelectorAll(".year-btn")
            .forEach(b=>b.classList.remove("active"));

        button.classList.add("active");

        selectedYear=button.dataset.year;

        filterCards();

    }

});

document.querySelectorAll(".type-btn").forEach(button=>{

    button.onclick=()=>{

        document.querySelectorAll(".type-btn")
            .forEach(b=>b.classList.remove("active"));

        button.classList.add("active");

        selectedType=button.dataset.type;

        filterCards();

    }

});

function filterCards(){

    document.querySelectorAll(".kit-card").forEach(card=>{

        let show=true;

        if(selectedCountry!="all" &&
           card.dataset.country!=selectedCountry)
            show=false;

        if(selectedYear!="all" &&
           card.dataset.year!=selectedYear)
            show=false;

        if(selectedType!="all" &&
           card.dataset.type!=selectedType)
            show=false;

        card.style.display=show?"block":"none";

    });

}