import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Monarchy} from '../../../base-governments/Governments.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';
import {Production} from '../../../base-terrain-yields/Yields/Production.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

RulesRegistry.register(new Rule(
  'city:cost:production:monarchy',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, city) => {
    const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', city.player);

    return playerGovernment.is(Monarchy);
  }),
  new Effect((tileYield, city) => {
    const supportedUnits = UnitRegistry.getBy('city', city)
      .length
    ;

    tileYield.subtract(supportedUnits);
  })
));
