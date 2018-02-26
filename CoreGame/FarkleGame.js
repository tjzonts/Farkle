
var tom = {
    name: "Tom",
    score: 0,
    currentTurnPoints: 0,
    hasQualified: false,
    holding: [],
    round: 0
};

var andy = {
    name: "Andy",
    score: 0,
    currentTurnPoints: 0,
    hasQualified: false,
    holding: [],
    round: 0
};

var art = {
    name: "Art",
    score: 0,
    currentTurnPoints: 0,
    hasQualified: false,
    holding: [],
    round: 0
};

var qualificationAmt = 100; //Currently game will bomb if set much higher as our AIs aren't created yet.
var winningScoreTarget = 10000; //Standard scoring amount
var numOfDice = 6;
var onesCount;
var twosCount;
var threesCount;
var foursCount;
var fivesCount;
var sixesCount;
var disqualified = false;
var turnOrder = [];
var turnQueue = [];
var diceHolding = [];
var isFinalRound = false;
var gameObj = { Tom: tom, Andy: andy, Art: art, qualificationAmt: qualificationAmt };

function SetupGame(){
    isFinalRound = false;

    debugger;
    initializeTurnOrder();
    initializePlayers();
    initializeUi();    
    
    beginRound();
}

function initializeTurnOrder() {
    //Randomly populate turnQueue to set player order
    var tempPlayer = [tom, andy, art];
    while (tempPlayer.length > 0){
        var num = Math.floor(Math.random() * tempPlayer.length);
        turnOrder.push(tempPlayer[num]);
        tempPlayer.splice(num,1);
    }
}

function initializePlayers() {
    for (var player of turnOrder) {
        player.score = 0;
        player.round = 0;
        player.hasQualified = 0;
    }
}

function beginRound(){
    turnQueue = turnOrder.slice(0, turnOrder.length);
    beginTurn();
}

function beginTurn(){
    if (turnQueue.length == 0){
        if (isFinalRound)
            gameOver();
        else
            beginRound();
    }
    disqualified = false;
    currentPlayer = turnQueue.shift(); //Grab 1st player from queue
    currentPlayer.currentTurnPoints = 0;
    currentPlayer.holding = [];
    currentPlayer.round++;
    turn();
}
        
function turn(){
    var numRolling = numOfDice - currentPlayer.holding.length;
    if (numRolling == 0)
        numRolling = numOfDice;

    //Roll dice
    gameObj.diceRolled = rollDice(numRolling);
    //If no points are rolled, turn is over
    if (!checkForPoints(gameObj.diceRolled))
        endTurn(currentPlayer, 0);
    var currentPoints;
    var response;
    switch(currentPlayer.name){
    case "Tom":
        response = TomTurn(gameObj);
        break;
    case "Art":
        response = ArtTurn(gameObj);
        break;
    case "Andy":
        response = AndyTurn(gameObj);
        break;
    }

    currentPlayer.holding = response.diceHolding;
    currentPoints = calculatePoints(currentPlayer.holding);
    if (response.rollAgain && !disqualified) {
        //currentPlayer.currentTurnPoints += currentPoints;
        turn();
    } else {
        endTurn(currentPlayer, currentPoints);
    }
}

function endTurn(currentPlayer, pointsScored){
    if (!currentPlayer.hasQualified && pointsScored >= qualificationAmt)
        currentPlayer.hasQualified = true;
    else if (currentPlayer.hasQualified){
        currentPlayer.score += pointsScored;
        if (currentPlayer.score > winningScoreTarget - 1)
            isFinalRound = true;
    }
    endTurnUpdateUi(currentPlayer, pointsScored);

    beginTurn();
}

function gameOver(){
    var winningScore = 0;
    var winnerName;
    for (var player of turnOrder){
        if (player.score > winningScore) {
            winningScore = player.score;
            winnerName = player.name;
        }
    }
    
    gameOverUpdateUi(winnerName);
}

function rollDice(numToRoll){
    var rolledDice = [];
    for (var d = 0; d < numToRoll; d++){
        rolledDice.push(Math.floor(Math.random() * 6) + 1);
    }
    return rolledDice;
}

function checkForPoints(diceRolled){
    var hasPoints = false;
    onesCount = 0;
    twosCount = 0;
    threesCount = 0;
    foursCount = 0;
    fivesCount = 0;
    sixesCount = 0;
    
    for(var die of diceRolled){
        switch(die){
        case 1:
            onesCount++;
            hasPoints = true;
            break;
        case 2:
            twosCount++;
            break;
        case 3:
            threesCount++;
            break;
        case 4:
            foursCount++;
            break;
        case 5:
            fivesCount++;
            hasPoints = true;
            break;
        case 6:
            sixesCount++;
            break;			
        }
    }	
    if (twosCount > 2 || threesCount > 2 || foursCount > 2 || sixesCount > 2){
            hasPoints = true;
        }			
    return hasPoints;
}

function calculatePoints(diceHolding){	
    var total = 0;
    var dhOnesCount = 0;
    var dhTwosCount = 0;
    var dhThreesCount = 0;
    var dhFoursCount = 0;
    var dhFivesCount = 0;
    var dhSixesCount = 0;
    for(var die of diceHolding){
        switch(die){
        case 1:
            dhOnesCount++;
            break;
        case 2:
            dhTwosCount++;
            break;
        case 3:
            dhThreesCount++;
            break;
        case 4:
            dhFoursCount++;
            break;
        case 5:
            dhFivesCount++;
            break;
        case 6:
            dhSixesCount++;
            break;			
        }
    }
    if (dhOnesCount < 3)
        total += dhOnesCount * 100;
    else {
        switch(dhOnesCount){
        case 3:
            total += 1000;
            break;
        case 4:
            total += 2000;
            break;
        case 5:
            total += 4000;
            break;
        case 6:
            total += 8000;
            break;
        }
    }
    if (dhTwosCount > 2){
        switch(dhTwosCount){
        case 3:
            total += 200;
            break;
        case 4:
            total += 400;
            break;
        case 5:
            total += 800;
            break;
        case 6:
            total += 1600;
            break;
        }
    }
    if (dhThreesCount > 2){
        switch(dhThreesCount){
        case 3:
            total += 300;
            break;
        case 4:
            total += 600;
            break;
        case 5:
            total += 1200;
            break;
        case 6:
            total += 2400;
            break;
        }
    }
    if (dhFoursCount > 2){
        switch(dhFoursCount){
        case 3:
            total += 400;
            break;
        case 4:
            total += 800;
            break;
        case 5:
            total += 1600;
            break;
        case 6:
            total += 3200;
            break;
        }
    }
    if (dhFivesCount < 3)
        total += dhFivesCount * 50;
    else {
        switch(dhFivesCount){
        case 3:
            total += 500;
            break;
        case 4:
            total += 1000;
            break;
        case 5:
            total += 2000;
            break;
        case 6:
            total += 4000;
            break;
        }
    }
    if (dhSixesCount > 2){
        switch(dhSixesCount){
        case 3:
            total += 600;
            break;
        case 4:
            total += 1200;
            break;
        case 5:
            total += 2400;
            break;
        case 6:
            total += 3200;
            break;
        }
    }
    //Validate returned dice to game dice
    var isValidated = true;
    if (dhOnesCount > onesCount || dhFivesCount > fivesCount)
        isValidated = false;
    if (dhTwosCount > 2 && (dhTwosCount != twosCount))
        isValidated = false;
    if (dhThreesCount > 2 && (dhThreesCount != threesCount))
        isValidated = false;
    if (dhFoursCount > 2 && (dhFoursCount != foursCount))
        isValidated = false;
    if (dhSixesCount > 2 && (dhSixesCount != sixesCount))
        isValidated = false;		
    
    if (!isValidated){
        total = 0;
        disqualified = true;
    }
    return total;
}