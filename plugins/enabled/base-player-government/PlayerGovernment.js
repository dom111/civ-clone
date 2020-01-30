import {Despotism} from '../base-governments/Governments.js';
import engine from 'engine';

export class PlayerGovernment {
  #government;
  #player;

  constructor(player) {
    this.#government = new Despotism();
    this.#player = player;
  }

  get() {
    return this.#government.constructor;
  }

  is(Government) {
    return this.#government instanceof Government;
  }

  get player() {
    return this.#player;
  }

  set(government) {
    this.#government = government;

    engine.emit('player:government:changed', this.#player, government);
  }
}

export default PlayerGovernment;
