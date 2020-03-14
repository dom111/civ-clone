import PlayerActionRegistry from './PlayerActionRegistry.js';
import RulesRegistry from '../core-rules/RulesRegistry.js';
import Tileset from '../core-world/Tileset.js';

export class Player {
  static id = 0;

  #rulesRegistry;
  #seenTiles = new Tileset();

  civilization;

  constructor({rulesRegistry = RulesRegistry.getInstance()} = {}) {
    this.id = Player.id++;
    this.#rulesRegistry = rulesRegistry;

    this.#rulesRegistry.process('player:added', this);
  }

  getAction() {
    const [action] = this.getActions();

    return action;
  }

  getActions() {
    return PlayerActionRegistry.getInstance()
      .entries()
      .flatMap((actionsProvider) => actionsProvider.provide(this))
    ;
  }

  hasActions() {
    const actions = this.getActions();

    return actions.length;
  }

  get rulesRegistry() {
    return this.#rulesRegistry;
  }

  get seenTiles() {
    return this.#seenTiles;
  }

  takeTurn() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented.'));
    });
  }
}

export default Player;