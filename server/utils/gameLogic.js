class GameLogic {
  static playBall(batsmanNumber, bowlerNumber) {
    if (batsmanNumber === bowlerNumber) {
      return { outcome: 'wicket', runs: 0 };
    }
    return { outcome: 'runs', runs: batsmanNumber };
  }

  static resolveToss(guess, number1, number2) {
    const sum = number1 + number2;
    const parity = sum % 2 === 0 ? 'even' : 'odd';
    const winner = parity === guess ? 'player1' : 'player2';
    return { sum, parity, winner };
  }

  static calculateWinRate(gamesWon, gamesPlayed) {
    if (gamesPlayed === 0) return 0;
    return ((gamesWon / gamesPlayed) * 100).toFixed(2);
  }

  static generateGameId() {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static isValidNumber(number) {
    return Number.isInteger(number) && number >= 1 && number <= 10;
  }
}

module.exports = GameLogic;
