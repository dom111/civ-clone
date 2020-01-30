import {Anarchy, Despotism} from '../../base-governments/Governments.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import PlayerGovernmentRegistry from '../../base-player-government/PlayerGovernmentRegistry.js';
import {Production} from '../../base-yields/Yields.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:cost:production:base',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, city) => {
    const [playerGovernment] = PlayerGovernmentRegistry
      .filter((playerGovernment) => playerGovernment.player === city.player)
    ;

    return playerGovernment.is(Despotism) ||
      playerGovernment.is(Anarchy)
    ;
  }),
  // For units like Caravan/Diplomat, they could extend a FreeUnit class or something and these could be filtered out
  new Effect((tileYield, city) => {
    const supportedUnits = city.units.length;

    if (supportedUnits > city.size) {
      tileYield.subtract(supportedUnits - city.size);
    }
  })
));
