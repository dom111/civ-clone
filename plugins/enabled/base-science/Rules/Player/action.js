import {ChooseResearch} from '../../PlayerActions.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerResearchRegistry from '../../PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  new Rule(
    'player:action:choose-research',
    new Criterion((player) => playerResearchRegistry.getBy('player', player)
      .some((research) => ! research.researching())
    ),
    new Criterion((player) => playerResearchRegistry.getBy('player', player)
      .some((research) => research.available()
        .length
      )
    ),
    new Effect((player) => playerResearchRegistry.getBy('player', player)
      .map((research) => new ChooseResearch(research))
    )
  ),
];

export default getRules;
