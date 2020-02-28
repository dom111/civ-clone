import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Gold} from '../../Yields.js';
import PlayerTreasuryRegistry from '../../PlayerTreasuryRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:process-yield:gold',
  new Criterion((cityYield) => cityYield instanceof Gold),
  new Effect((cityYield, city) => {
    const [playerTreasury] = PlayerTreasuryRegistry.getBy('player', city.player);

    playerTreasury.add(cityYield);
    RulesRegistry.get('player:treasury:updated')
      .filter((rule) => rule.validate(playerTreasury, city))
      .forEach((rule) => rule.process(playerTreasury, city))
    ;
  })
));
