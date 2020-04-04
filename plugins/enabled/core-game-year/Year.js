import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import Turn from '../core-turn-based-game/Turn.js';

export class Year {
  #cache = new Map();
  static #instance;
  #rulesRegistry;
  #turn;

  constructor({
    rulesRegistry = RulesRegistry.getInstance(),
    turn = Turn.getInstance(),
  } = {}) {
    this.#rulesRegistry = rulesRegistry;
    this.#turn = turn;
  }

  static getInstance() {
    if (! this.#instance) {
      this.#instance = new this();
    }

    return this.#instance;
  }

  value({
    turn = this.#turn.value(),
  } = {}) {
    if (! this.#cache.has(turn)) {
      const [year] = this.#rulesRegistry.process('turn:year', turn);

      this.#cache.set(turn, year);
    }

    return this.#cache.get(turn);
  }
}

export default Year;
