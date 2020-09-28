import {Gold as GoldYield} from '../base-currency/Yields.js';
import GoodyHutAction from '../core-goody-huts/GoodyHutAction.js';
import PlayerTreasuryRegistry from '../base-currency/PlayerTreasuryRegistry.js';

export class Gold extends GoodyHutAction {
  /** @type {PlayerTreasuryRegistry} */
  #playerTreasuryRegistry;

  /**
   * @param goodyHut {GoodyHut}
   * @param playerTreasuryRegistry {PlayerTreasuryRegistry}
   * @param unit {Unit}
   */
  constructor({
    goodyHut,
    playerTreasuryRegistry = PlayerTreasuryRegistry.getInstance(),
    unit,
  } = {}) {
    super({
      goodyHut,
      unit,
    });

    this.#playerTreasuryRegistry = playerTreasuryRegistry;
  }

  perform() {
    const [playerTreasury] = this.#playerTreasuryRegistry.getBy('player', this.unit()
      .player()
    );

    playerTreasury.add(new GoldYield(50));
  }
}

export default Gold;
