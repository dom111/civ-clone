import Interaction from './Interaction.js';
import Registry from '../core-registry/Registry.js';

export class InteractionRegistry extends Registry {
  constructor() {
    super(Interaction);
  }

  getByPlayer(player) {
    return this.entries()
      .filter((interaction) => interaction.players()
        .includes(player)
      )
    ;
  }

  getByPlayers(...players) {
    return this.entries()
      .filter((interaction) => interaction.isBetween(...players))
    ;
  }
}

export default InteractionRegistry;
