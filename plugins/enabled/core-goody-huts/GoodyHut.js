import GoodyHutAction from './GoodyHutAction.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';

export class GoodyHut {
  /** @type {RulesRegistry} */
  #rulesRegistry;
  /** @type {Tile} */
  #tile;

  /**
   * @param rulesRegistry {RulesRegistry}
   * @param tile {Tile}
   */
  constructor({
    rulesRegistry = RulesRegistry.getInstance(),
    tile,
  }) {
    this.#rulesRegistry = rulesRegistry;
    this.#tile = tile;
  }

  /**.
   * @param action {GoodyHutAction}
   */
  action(action) {
    if (! (action instanceof GoodyHutAction)) {
      return;
    }

    action.perform();

    this.#rulesRegistry.process('goody-hut:action-performed', this, action);
  }

  /**
   * @param unit {Unit}
   * @returns {GoodyHutAction[]}
   */
  actions(unit) {
    return this.#rulesRegistry.process('goody-hut:action', this, unit);
  }

  process(unit) {
    return this.#rulesRegistry.process('goody-hut:discovered', this, unit);
  }

  /**
   * @returns {Tile}
   */
  tile() {
    return this.#tile;
  }
}

export default GoodyHut;
