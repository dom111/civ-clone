import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerResearchRegistry from '../../PlayerResearchRegistry.js';
import {Research} from '../../Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:process-yield:science',
  new Criterion((cityYield) => cityYield instanceof Research),
  new Effect((cityYield, city) => {
    const [playerResearch] = PlayerResearchRegistry.getBy('player', city.player);

    playerResearch.add(cityYield);
  })
));
