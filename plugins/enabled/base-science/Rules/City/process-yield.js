import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerResearchRegistry from '../../PlayerResearchRegistry.js';
import {Research} from '../../Yields.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:process-yield:science',
    new Criterion((cityYield) => cityYield instanceof Research),
    new Effect((cityYield, city) => {
      const [playerResearch] = playerResearchRegistry.getBy('player', city.player());

      playerResearch.add(cityYield);
    })
  ),
];

export default getRules;
