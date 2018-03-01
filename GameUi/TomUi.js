function initializeUi(players) {
    _.forEach(players, (player, index) => {
        clearScreen(player.name + "TextArea");
        changeNameText(player.name, player.name + " (" + (index + 1) + ")");
    });
}

function beginTurnUpdateUi(currentPlayer) {
    var msg = "---------------------- Round " + currentPlayer.recentTurn.round + " ----------------------\n";
    println(currentPlayer.name + "TextArea", msg);
}

function endTurnUpdateUi(currentPlayer) {
    println(currentPlayer.name + "TextArea", "Points Gained this Round: " + currentPlayer.recentTurn.turnPoints);
    println(currentPlayer.name + "TextArea", "Total Score: " + currentPlayer.score + "\n");
}

function gameOverUpdateUi(winnerName) {
    print(winnerName, " - WINNER!");
}

function displayDice(currentPlayer, currentRoll){
    var dice = "Roll " + currentRoll.rollSequence + "\t[" + currentRoll.roll.toString() + "] ";
    var heldDice = "Held\t\t[" + currentRoll.hold.toString() + "]";
    var points = "+" + currentRoll.holdPoints + " pnts\tRound pnts: " + currentPlayer.recentTurn.turnPoints + "\n";

    println(currentPlayer.name + "TextArea", dice);
    println(currentPlayer.name + "TextArea", heldDice);
    println(currentPlayer.name + "TextArea", points);
}

function println(id, text = "") {
    print(id, text + "\n");
}

function print(id, text) {
    document.getElementById(id).innerHTML += text;
}

function changeNameText(name, text) {
    document.getElementById(name).innerHTML = text;
}

function clearScreen(id) {
    document.getElementById(id).innerHTML = "";
}