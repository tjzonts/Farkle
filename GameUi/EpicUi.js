function initializeUi(players) {
    _.forEach(players, (player) => {
        clearScreen(player.name + "TextArea");
        changeNameText(player.name, player.name + " (" + player.turnOrder + ")");
    });
}

function beginTurnUpdateUi(currentPlayer) {
    var msg = "---------------------- Round " + currentPlayer.recentTurn.round + " ----------------------\n";
    println(currentPlayer.name + "TextArea", msg);
}

function endTurnUpdateUi(currentPlayer) {
    if (currentPlayer.hasQualified && currentPlayer.score === 0 && !currentPlayer.disqualified && !currentPlayer.bust)
        println(currentPlayer.name + "TextArea", "Qualified to score this Round!");
    else
        println(currentPlayer.name + "TextArea", "Points Gained this Round: " + currentPlayer.recentTurn.turnPoints);
        
    println(currentPlayer.name + "TextArea", "Total Score: " + currentPlayer.score + "\n");
}

function gameOverUpdateUi(winnerName) {
    print(winnerName, " - WINNER!");
}

function displayDice(currentPlayer, currentRoll) {
    var dice = "Roll " + currentRoll.rollSequence + "\t[" + currentRoll.roll.toString() + "] ";
    var heldDice = "Held\t\t[" + currentRoll.hold.toString() + "]";
    var hotstreak = false;
    var rollPnts = "";
    if (currentRoll.disqualified) {
        rollPnts = "CHEATER!";
    } else if (currentRoll.bust) {
        rollPnts = "BUST!\t";
    } else {
        rollPnts = "+" + currentRoll.holdPoints + " pnts";
        if (currentRoll.roll.length === currentRoll.hold.length)
            hotstreak = true;
    }
    var points = rollPnts + "\tRound pnts: " + currentPlayer.recentTurn.turnPoints + "\n";    

    println(currentPlayer.name + "TextArea", dice);
    println(currentPlayer.name + "TextArea", heldDice);
    println(currentPlayer.name + "TextArea", points);
    if (hotstreak)
        println(currentPlayer.name + "TextArea", "HOTSTREAK! You're Unstoppable!!!\n");
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
