import GoodyHutAction from '../core-goody-huts/GoodyHutAction.js';
import PlayerTreasuryRegistry from '../base-currency/PlayerTreasuryRegistry.js';

export class Gold extends GoodyHutAction {
  #playerTreasuryRegistry;

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

    playerTreasury.add(new Gold(50));
  }
}

export default Gold;
