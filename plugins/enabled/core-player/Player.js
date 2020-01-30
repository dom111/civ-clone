import PlayerActionRegistry from './PlayerActionRegistry.js';
import Tileset from '../core-world/Tileset.js';

export class Player {
  static id = 0;

  #seenTiles = new Tileset();

  civilization;

  constructor() {
    this.id = Player.id++;
    this.cities = [];
    this.units = [];

    engine.emit('player:added', this);
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

  get unitsToAction() {
    return this.units.filter((unit) => unit.active && unit.movesLeft);
  }

  get citiesToAction() {
    return this.cities.filter((city) => ! city.building);
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
      reject('Not implemented.');
    });
  }
}

export default Player;