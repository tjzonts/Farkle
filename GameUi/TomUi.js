function initializeUi() {
    document.getElementById("TomTextArea").innerHTML = "";
    document.getElementById("ArtTextArea").innerHTML = "";
    document.getElementById("AndyTextArea").innerHTML = "";
    document.getElementById("Tom").innerHTML = "Tom";
    document.getElementById("Art").innerHTML = "Art";
    document.getElementById("Andy").innerHTML = "Andy";
}

function endTurnUpdateUi(currentPlayer, pointsScored) {
    var msg = "Round " + currentPlayer.round + ": " + pointsScored + " (" + currentPlayer.score + " total)\n";
    switch (currentPlayer.name){
        case "Tom":
        document.getElementById("TomTextArea").innerHTML += msg;
        break;
        case "Art":
        document.getElementById("ArtTextArea").innerHTML += msg;
        break;
        case "Andy":
        document.getElementById("AndyTextArea").innerHTML += msg;
        break;
    }
}

function gameOverUpdateUi(winnerName) {
    document.getElementById(winnerName).innerHTML += "-WINNER!";
}