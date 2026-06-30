fetch(CONFIG.BASE + "components/header.html")

.then(r=>r.text())

.then(data=>{

document.getElementById("header").innerHTML=data;

document.querySelectorAll('[data-link="group"]').forEach(link => {

    const year = link.dataset.year;
    const group = link.dataset.group;

    link.href =
        CONFIG.BASE +
        "2022/groups/group.html?year="+year+"&group="+group;

});
document.querySelectorAll(".submenu-toggle").forEach(button => {

    button.addEventListener("click", function(e){

        e.preventDefault();

        const submenu = this.nextElementSibling;

        submenu.classList.toggle("open");

    });
});
});
