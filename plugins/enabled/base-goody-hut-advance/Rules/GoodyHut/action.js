import Advance from '../../Advance.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  new Rule(
    'goody-hut:action:advance',
    new Criterion((goodyHut, unit) => playerResearchRegistry.getBy('player', unit.player())
      .some((playerResearch) => playerResearch.available()
        .length > 0
      )
    ),
    new Effect((goodyHut, unit) => new Advance({
      goodyHut,
      unit,
    }))
  ),
];

export default getRules;
