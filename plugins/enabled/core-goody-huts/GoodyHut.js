import GoodyHutAction from './GoodyHutAction.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';

export class GoodyHut {
  #rulesRegistry;
  #tile;

  constructor({
    rulesRegistry = RulesRegistry.getInstance(),
    tile,
  }) {
    this.#rulesRegistry = rulesRegistry;
    this.#tile = tile;
  }

  action(action) {
    if (! (action instanceof GoodyHutAction)) {
      return;
    }

    return action.perform();
  }

  actions(unit) {
    return this.#rulesRegistry.process('goody-hut:action', this, unit);
  }

  process(unit) {
    return this.#rulesRegistry.process('goody-hut:discovered', this, unit);
  }

  tile() {
    return this.#tile;
  }
}

export default GoodyHut;
