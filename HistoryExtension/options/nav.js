pagelist = ["home", "stats"]
fetch('nav.html')
.then(res => res.text())
.then(text => {
    pagelist.forEach(page => text = text.replace("class=\"tablink active\" id=\"" + page +"\"", "class=\"tablink\" id=\"" + page +"\""));
    // get the current page
    let urlArr = document.URL.split("/");
    let pageName = urlArr[urlArr.length - 1].split(".")[0];
    text = text.replace("class=\"tablink\" id=\"" + pageName +"\"", "class=\"tablink active\" id=\"" + pageName +"\"");
    let oldelem = document.querySelector("script#replace_with_navbar");
    let newelem = document.createElement("div");
    newelem.innerHTML = text;
    oldelem.parentNode.replaceChild(newelem,oldelem);
})

