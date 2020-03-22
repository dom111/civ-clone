import {Despotism} from '../base-governments/Governments.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';

export class PlayerGovernment {
  #government;
  #player;
  #rulesRegistry;

  constructor({
    player,
    rulesRegistry = RulesRegistry.getInstance(),
  } = {}) {
    this.#government = new Despotism();
    this.#player = player;
    this.#rulesRegistry = rulesRegistry;
  }

  get() {
    return this.#government.constructor;
  }

  is(...governments) {
    return governments.some((Government) => this.#government instanceof Government);
  }

  player() {
    return this.#player;
  }

  set(government) {
    this.#government = government;

    this.#rulesRegistry.process('player:government-changed', this.#player, government);
  }
}

export default PlayerGovernment;
