fetch("/weltPokal/components/header.html")

.then(r=>r.text())

.then(data=>{

document.getElementById("header").innerHTML=data;

});