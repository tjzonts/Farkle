/* 
  Proposed currentTurn format to pass all relevant turn information to current AI to calculate their next move.
  This is a read-only object that the AI can use to know their current turn state and all actions they have done previously on this turn.
*/
currentTurn = {
            currentRoll: {
                turnRoll: 3, // This is the third roll of this turn.
                roll: [1, 3, 3], // The results for this roll that you must choose which to keep.
                potentialScore: 300 // The sum of all previousRolls rollScore.
            },
            previousRolls: [
                {
                    turnRoll: 1, // This was the first roll of this turn.
                    roll: [1, 2, 2, 3, 3, 5], // All the dice results for this roll.
                    kept: [1], // The dice that the AI kept.
                    discarded: [2, 2, 3, 3, 5], // The dice that the AI rerolled.
                    rollScore: 100 // Points for the kept dice for this specific roll.
                },
                {
                    turnRoll: 2, // This was the second roll of this turn.
                    roll: [1, 1, 5, 6, 6], // All the dice results for this roll.
                    kept: [1, 1], // The dice that the AI kept.
                    discarded: [5, 6, 6], // The dice that the AI rerolled.
                    rollScore: 200 // Points for the kept dice for this specific roll.
                }]
        };
