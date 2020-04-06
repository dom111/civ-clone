import Expiry from './Expiry.js';
import Interaction from './Interaction.js';
import Player from '../core-player/Player.js';

export class Declaration extends Interaction {
  #expiry = new Expiry(Infinity);

  constructor(...args) {
    const players = args.filter((arg) => arg instanceof Player);

    super(...players);

    args.forEach((arg) => {
      if (arg instanceof Expiry) {
        this.#expiry = arg;
      }
    });
  }

  expiry() {
    return this.#expiry;
  }
}

export default Declaration;
