navbar = document.getElementById("navbar")
tablinks = document.getElementsByClassName("tablink");
for (i = 0; i < tablinks.length; i++) {
    console.log(tablinks[i]);

    tablinks.className = tablinks[i].className.replace(" active", "");
}
document.getElementById("stats").style.display = "block";
document.getElementById("stats").className += " active";
console.log("HI");