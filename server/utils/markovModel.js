const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

class MarkovModel {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;

    if (difficulty === 'easy') {
      this.randomness = 0.7;
    } else if (difficulty === 'hard') {
      this.randomness = 0.15;
    } else {
      this.randomness = 0.4;
    }
  }

  getRandomNumber() {
    return NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  }

  buildTransitionCounts(history) {
    const counts = {};
    NUMBERS.forEach((n) => {
      counts[n] = {};
      NUMBERS.forEach((next) => {
        counts[n][next] = 1;
      });
    });

    for (let i = 0; i < history.length - 1; i++) {
      const current = history[i];
      const next = history[i + 1];
      counts[current][next] += 1;
    }

    return counts;
  }

  predictNextNumber(history) {
    if (!history || history.length === 0) {
      return this.getRandomNumber();
    }

    if (Math.random() < this.randomness) {
      return this.getRandomNumber();
    }

    const lastNumber = history[history.length - 1];
    const counts = this.buildTransitionCounts(history);
    const distribution = counts[lastNumber];

    const total = Object.values(distribution).reduce((sum, c) => sum + c, 0);
    let predicted = lastNumber;
    let highestProb = -1;

    NUMBERS.forEach((n) => {
      const prob = distribution[n] / total;
      if (prob > highestProb) {
        highestProb = prob;
        predicted = n;
      }
    });

    return predicted;
  }

  chooseBotNumber(opponentHistory, botRole) {
    if (Math.random() < this.randomness) {
      return this.getRandomNumber();
    }

    const predictedOpponentNumber = this.predictNextNumber(opponentHistory);

    if (botRole === 'bowl') {
      return predictedOpponentNumber;
    }

    let avoidNumber = this.getRandomNumber();
    while (avoidNumber === predictedOpponentNumber) {
      avoidNumber = this.getRandomNumber();
    }
    return avoidNumber;
  }
}

module.exports = MarkovModel;
