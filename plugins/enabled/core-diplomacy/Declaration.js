import Expiry from './Expiry.js';
import Interaction from './Interaction.js';
import Player from '../core-player/Player.js';

export class Declaration extends Interaction {
  /** @type Expiry */
  #expiry = new Expiry(Infinity);

  /**
   * @param args {...(Player|Expiry)}
   */
  constructor(...args) {
    const players = args.filter((arg) => arg instanceof Player);

    super(...players);

    args.forEach((arg) => {
      if (arg instanceof Expiry) {
        this.#expiry = arg;
      }
    });
  }

  /**
   * @returns {Expiry}
   */
  expiry() {
    return this.#expiry;
  }
}

export default Declaration;
