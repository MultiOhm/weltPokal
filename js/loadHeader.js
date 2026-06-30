fetch(CONFIG.BASE + "components/header.html")

.then(r=>r.text())

.then(data=>{

document.getElementById("header").innerHTML=data;

document.querySelector('[data-link="group-a"]').href =
        CONFIG.BASE + "2022/groups/a.html";
});