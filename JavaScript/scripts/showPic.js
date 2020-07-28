
function showPic(whichpic) {
    var sourse = whichpic.getAttribute("href");
    var placeholder = document.getElementById("placeholder");
    placeholder.setAttribute("src",sourse);
    var text = whichpic.getAttribute("title");
    var description = document.getElementById("description");
    description.firstChild.nodeValue = text;
}

function prepareGllery () {
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) return false;
    if (!document.getElementById("imagegllery")) return false;
    var gallery = document.getElementById("imagegllery") ;
    var links = gallery.getElementsByTagName("a");
    for ( var i=0; i<links.length; i++){
        links[i].onclick = function(){
            return showPic(this) ? false : true;
        }
    }
}