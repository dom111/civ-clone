import PlayerActionRegistry from './PlayerActionRegistry.js';
import Tileset from '../core-world/Tileset.js';

export class Player {
  static id = 0;

  #seenTiles = new Tileset();

  civilization;

  constructor() {
    this.id = Player.id++;
  }

  getAction() {
    const [action] = this.getActions();

    return action;
  }

  getActions() {
    return PlayerActionRegistry.entries()
      .flatMap((actionsProvider) => actionsProvider.provide(this))
    ;
  }

  hasActions() {
    const actions = this.getActions();

    return actions.length;
  }

  get seenTiles() {
    return this.#seenTiles;
  }

  takeTurn() {
    return promiseFactory((resolve, reject) => {
      reject(new Error('Not implemented.'));
    });
  }
}

export default Player;