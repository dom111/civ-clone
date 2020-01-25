import Player from './Player.js';

export class AIPlayer extends Player {
  static #implementations = [];

  chooseCivilization(choices) {
    const Random = choices[Math.floor(choices.length * Math.random())];

    this.civilization = new Random();

    this.chooseLeader(this.civilization);
  }

  chooseLeader(civilization) {
    this.leader = civilization.leaders[Math.floor(civilization.leaders.length * Math.random())];
  }

  static register(constructor) {
    if (! this.#implementations.includes(constructor)) {
      this.#implementations.push(constructor);
    }
  }

  static get() {
    return new (this.#implementations[Math.floor(this.#implementations.length * Math.random())]);
  }
}

export default AIPlayer;
