// Andy approved vars:
var gameRules;

var simulateGameCount = 1;

var gameRound = 0;
var turnOrder = [];
var isFinalRound = false;
var scoringSystem;
var currentRollCounts;

function SetupGame() {
    //debugger;
    gameRules = {
        qualificationAmt: 100,
        winningScoreTarget: 10000,
        numOfDice: 6,
        setScoringRule: "Doubling"
    };

    scoringSystem = setupScoreRules({ "setRule": gameRules.setScoringRule });
    var players = [
        {
            name: "Tom",
            rollMethod: TomTurn
        }, {
            name: "Andy",
            rollMethod: AndyTurn
        }, {
            name: "Art",
            rollMethod: ArtTurn
        }];

    initializeVariables();
    initializePlayers(players);
    initializeUi(turnOrder);
           
    beginRound();
}

function initializeVariables() {
    gameRound = 0;
    turnOrder = [];
    isFinalRound = false;
}

function initializePlayers(players) {
    turnOrder = _.shuffle(players);

    _.forEach(turnOrder, (player, index) => {
        player.score = 0;
        player.hasQualified = false;
        player.recentTurn = null;
        player.turnOrder = (index + 1);
    });
}

function beginRound(){
    gameRound++;
    
    _.forEach(turnOrder, (player) => {
        beginTurn(player);
    });

    endRound();
}

function beginTurn(currentPlayer){
    currentPlayer.recentTurn = {
        round: gameRound,
        turnPoints: 0,
        rolls: []
    };

    beginTurnUpdateUi(currentPlayer);
    roll(currentPlayer, gameRules.numOfDice);
}
        
function roll(currentPlayer, numRolling) {
    var currentRoll = {
        rollSequence: currentPlayer.recentTurn.rolls.length + 1,
        roll: [],
        hold: [],
        reroll: [],
        bust: false,
        disqualified: false,
        holdPoints: 0
    };
    currentPlayer.recentTurn.rolls.push(currentRoll);

    //Roll dice
    currentRoll.roll = rollDice(numRolling);
    //If no points are rolled, turn is over
    if (!checkForPoints(currentRoll.roll)) {
        currentRoll.bust = true;
        displayDice(currentPlayer, currentRoll);
        endTurn(currentPlayer, 0);
    } else {
        // Call AI's rollMethod:
        var response = currentPlayer.rollMethod({ diceRolled: currentRoll.roll, players: turnOrder, gameRules: gameRules, isFinalRound: isFinalRound });
        currentRoll.hold = response.diceHolding;

        currentRoll.disqualified = true;
        // Get points for held dice and check if dice held are valid:
        if (currentRoll.hold.length > 0) {
            var checkPoints = calculatePoints(currentRoll.hold);
            currentRoll.disqualified = checkPoints.disqualified;
        }

        if (currentRoll.disqualified) {
            currentRoll.holdPoints = 0;
            currentPlayer.recentTurn.turnPoints = 0;
            displayDice(currentPlayer, currentRoll);
            endTurn(currentPlayer);
        } else {
            currentRoll.holdPoints = checkPoints.points;
            currentPlayer.recentTurn.turnPoints += currentRoll.holdPoints;

            displayDice(currentPlayer, currentRoll);

            if (response.rollAgain) {
                var reroll = _.slice(currentRoll.roll);
                _.forEach(currentRoll.hold, (die) => {
                    _.pullAt(reroll, _.indexOf(reroll, die));
                });
                currentRoll.reroll = reroll;

                roll(currentPlayer, numRolling - currentRoll.hold.length);
            } else {
                endTurn(currentPlayer);
            }
        }
    }
}

function endTurn(currentPlayer){
    if (!currentPlayer.hasQualified && currentPlayer.recentTurn.turnPoints >= gameRules.qualificationAmt) {
        currentPlayer.hasQualified = true;
    } else if (currentPlayer.hasQualified) {
        currentPlayer.score += currentPlayer.recentTurn.turnPoints;
        if (currentPlayer.score >= gameRules.winningScoreTarget)
            isFinalRound = true;
    }

    endTurnUpdateUi(currentPlayer);
}

function endRound() {
    if (isFinalRound) {
        gameOver();
    } else {
        beginRound();
    }
}

function gameOver(){
    var winningScore = 0;
    var winnerName = "";
     _.forEach(turnOrder, (player)=> {
         if (player.score > winningScore){
             winningScore = player.score;
             winnerName = player.name;
         }
     });
    
    gameOverUpdateUi(winnerName);
}

function rollDice(numToRoll){
    var rolledDice = [];
    for (var d = 0; d < numToRoll; d++){
        rolledDice.push(_.random(1, 6));
    }
    return rolledDice;
}

function checkForPoints(diceRolled){
    var hasPoints = false;
    currentRollCounts = getDieCounts(diceRolled);
    
    _.forEach(currentRollCounts, (count, dieNum) => {
        switch (dieNum) {
            case '1':
            case '5':
                if (count > 0)
                    hasPoints = true;
                break;
            default:
                if (count >= 3)
                    hasPoints = true;
                break;
        }
    });

    return hasPoints;
}

function calculatePoints(diceHolding) {
    var counts = getDieCounts(diceHolding);
    var total = 0;
    
    //Validate returned dice to game dice
    var isValidated = true;
    var disqualified = false;
    _.forEach(counts, (count, dieNum) => {
        if (currentRollCounts[dieNum] < count) {
            isValidated = false;
        } else if (count >= 3) {
            total += scoringSystem.tripPoints[dieNum] * scoringSystem.setMultiplier[count];
        } else if ((dieNum === "1" || dieNum === "5") && (count === 1 || count === 2)) {
            total += scoringSystem[dieNum] * count;
        }
    });

    if (!isValidated) {
        total = 0;
        disqualified = true;
    }
    return { points: total, disqualified: disqualified };
}

/* -----------------------------Scoring Logic Below----------------------------- */

function setupScoreRules(variantRules) {
    // Scoring rules:
    // Set point multiplier:
    const setRule = variantRules.setRule;
    //const setRule = "Adding";
    //const setRule = "Doubling";
    //const setRule = "Set1000";
    //const setRule = "Set2000";
    // Default it Multiply:
    let setMultiplier = [0, 0, 0, 1, 2, 4, 8]; // Index corrisponds to count of set.
    if (setRule === "Multiply") {
        setMultiplier = [0, 0, 0, 1, 2, 4, 8];
    } else if (setRule === "Add") {
        setMultiplier = [0, 0, 0, 1, 2, 3, 4];
    }

    return {
        tripPoints: {
            "1": 1000,
            "2": 200,
            "3": 300,
            "4": 400,
            "5": 500,
            "6": 600
        },
        setMultiplier: setMultiplier,
        "1": 100,
        "5": 50
    };
}

function getDieCounts(roll) {
    var counts = _.countBy(roll);
    counts["1"] = counts["1"] || 0;
    counts["2"] = counts["2"] || 0;
    counts["3"] = counts["3"] || 0;
    counts["4"] = counts["4"] || 0;
    counts["5"] = counts["5"] || 0;
    counts["6"] = counts["6"] || 0;

    return counts;
}
