
// Inform user to view webpage on a computer
window.onload = function() {
    if (window.matchMedia("(max-width: 767px)").matches) {
        alert("Visit this webpage on a computer for the best experience.");
    }

    if (!window.chrome) {
        alert("Visit this webpage on the Chrome browser for the best experience.");
    }
}
