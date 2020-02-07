import {Despotism} from '../base-governments/Governments.js';

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

  is(...governments) {
    return governments.some((Government) => this.#government instanceof Government);
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
