/*
Please do not change the function name or filename, as they both are hardcoded in the game.
Your namesake function will be called on your turn passing a game object with the following properties:
	Player object containing
			name, 
			score (locked in points from previous turns), 
			currentTurnPoints (points earning this turn, not locked in yet), 
			hasQualified (boolean whether you have qualified yet), 
			holding (dice you currently are holding, may remove this), 
			round (what round the player has completed)
	qualificationAmt = 500;
Please return an object with an array of dice (face value) you plan on holding onto for scoring
named "diceHolding" and a boolean named "rollAgain" to indicate whether you want to continue or
end your turn; sample:  return { diceHolding: [1,1,2,2,2], rollAgain: false}
	*/
function ArtTurn(){
	var response = { diceHolding: [1,5], rollAgain: false}
		return response;
}
