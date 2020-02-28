import Yield from '../core-yields/Yield.js';

export class PlayerTreasury extends Yield {
  #player;

  constructor(player) {
    super();

    this.#player = player;
  }

  get player() {
    return this.#player;
  }
}

export default PlayerTreasury;