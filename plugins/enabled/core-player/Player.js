import PlayerActionRegistry from './PlayerActionRegistry.js';
import RulesRegistry from '../core-rules-registry/RulesRegistry.js';
import Tileset from '../core-world/Tileset.js';

export class Player {
  static id = 0;

  #playerActionRegistry;
  #rulesRegistry;
  #seenTiles = new Tileset();

  // TODO: setter for this
  civilization;

  constructor({
    playerActionRegistry = PlayerActionRegistry.getInstance(),
    rulesRegistry = RulesRegistry.getInstance(),
  } = {}) {
    this.id = Player.id++;
    this.#rulesRegistry = rulesRegistry;
    this.#playerActionRegistry = playerActionRegistry;

    this.#rulesRegistry.process('player:added', this);
  }

  getAction() {
    const [action] = this.getActions();

    return action;
  }

  getActions() {
    return this.#playerActionRegistry.entries()
      .flatMap((actionsProvider) => actionsProvider.provide(this))
    ;
  }

  hasActions() {
    const actions = this.getActions();

    return actions.length;
  }

  seenTiles() {
    return this.#seenTiles;
  }

  takeTurn() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented.'));
    });
  }
}

export default Player;