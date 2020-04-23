import {Despotism} from '../base-governments/Governments.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';

export class PlayerGovernment {
  /** @type {Government} */
  #government;
  /** @type {Player} */
  #player;
  /** @type {RulesRegistry} */
  #rulesRegistry;

  /**
   * @param player {Player}
   * @param rulesRegistry {RulesRegistry}
   */
  constructor({
    player,
    rulesRegistry = RulesRegistry.getInstance(),
  } = {}) {
    this.#government = new Despotism();
    this.#player = player;
    this.#rulesRegistry = rulesRegistry;
  }

  /**
   * @returns {class}
   */
  get() {
    return this.#government.constructor;
  }

  /**
   * @param governments {...Government}
   * @returns {boolean}
   */
  is(...governments) {
    return governments.some((Government) => this.#government instanceof Government);
  }

  /**
   * @returns {Player}
   */
  player() {
    return this.#player;
  }

  /**
   * @param government {Government}
   */
  set(government) {
    this.#government = government;

    this.#rulesRegistry.process('player:government-changed', this.#player, government);
  }
}

export default PlayerGovernment;
