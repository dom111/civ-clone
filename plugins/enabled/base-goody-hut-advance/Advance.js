import GoodyHutAction from '../core-goody-huts/GoodyHutAction.js';
import PlayerResearchRegistry from '../base-science/PlayerResearchRegistry.js';

export class Advance extends GoodyHutAction {
  /** @type {PlayerResearchRegistry} */
  #playerResearchRegistry;

  /**
   * @param goodyHut {GoodyHut}
   * @param playerResearchRegistry {PlayerResearchRegistry}
   * @param unit {Unit}
   */
  constructor({
    goodyHut,
    playerResearchRegistry = PlayerResearchRegistry.getInstance(),
    unit,
  } = {}) {
    super({
      goodyHut,
      unit,
    });

    this.#playerResearchRegistry = playerResearchRegistry;
  }

  perform() {
    const [playerResearch] = this.#playerResearchRegistry.getBy('player', this.unit()
      .player()
    ),
      availableResearch = playerResearch.available(),
      RandomAdvance = availableResearch[Math.floor(availableResearch.length * Math.random())]
    ;

    playerResearch.addAdvance(RandomAdvance);
  }
}

export default Advance;
