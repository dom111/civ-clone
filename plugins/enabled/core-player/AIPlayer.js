import Player from './Player.js';

export class AIPlayer extends Player {
  // TODO: basic AI implementation, or at least methods to be called from another AI implementation
  chooseCivilization(choices) {
    this.civilization = choices[choices.length * Math.random()];

    return this.civilization;
  }
}

export default AIPlayer;
