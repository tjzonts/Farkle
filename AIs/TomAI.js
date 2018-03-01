/*
Please do not change the function name or filename, as they both are hardcoded in the game.

Your namesake function will be called on your turn passing a game object with the following properties:
    diceRolled: integer[]                   Array of all of the dice currently rolled.
    isFinalRound: boolean                   True if a player has ended their turn with a score >= winningScoreTarget. Game ends once this round completes.
    gameRules: Object = {                   Object containing information about the game rules/varients used.
        numOfDice: integer                  The maximum number of dice that can be rolled at once.
        qualificationAmt: integer           The points that must be achieved in a single turn before the player can begin scoring points.
        setScoringRule: string              The rules used to score x-of-a-kind. "Adding" or "Doubling" (Will implement Set scoring in the future).
        winningScoreTarget: integer         The total score a player must obtain to set isFinalRound and end the game after the round completes.
    }
    players: Object[] = {                   Array of Objects containing each player and information about the player.
        hasQualified: boolean               True if the player has ended a turn with points >= gameRules.qualificationAmt.
        name: string                        Player's name.
        score: integer                      Player's total score.
        turnOrder: integer                  Whether this player goes first, second, etc. in each round.
        recentTurn: Object = {              Object containing all information about this player's most recent turn. Null if the player hasn't had any turns yet. recentTurn is the currentTurn for the active player.
            round: integer                  The Round # that this turn occurred on.
            turnPoints: integer             The total points gained from this turn.
            rolls: Object[] = {             Array of Objects containing every roll that occurred for this player's recentTurn.
                bust: boolean               True if the player rolled no scoring die.
                disqualified: boolean       True if the player attempted an illegal action. Automatically ends player's turn and scores 0 points.
                hold: integer[]             Array of dice rolled that the player held for points.
                holdPoints: integer         The amount of points gained from the dice held.
                reroll: integer[]           Array of dice that were rerolled. Empty if this was the players last roll for the turn.
                roll: integer[]             Array of all dice rolled.
                rollSequence: integer       Whether this was the first, second, etc. roll of the turn.
            }
        }
    }

Please return an object with an array of dice (face value) you plan on holding onto for scoring
named "diceHolding" and a boolean named "rollAgain" to indicate whether you want to continue or
end your turn; sample:  return { diceHolding: [1,1,2,2,2], rollAgain: false}
*/

	function TomTurn(gameObj){
		var holding = [];
	var diceCount = gameObj.diceRolled.length;
	var rollAgain = true;
	for(var die of gameObj.diceRolled) {
		if (die === 1) {
			holding.push(die);
		}
	}
	var nextRollCount = diceCount - holding.length;
	if (nextRollCount < 4 && nextRollCount > 0) {
		rollAgain = false;
		for(var die of gameObj.diceRolled) {
			if (die === 5) {
				holding.push(die);
			}
		}
	}

	var response = { diceHolding: holding, rollAgain: rollAgain};
	return response;
		}

