import {Anarchy, Despotism, Monarchy} from '../../../base-governments/Governments.js';
import {Food, Production} from '../../../base-terrain-yields/Yields.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerGovernmentRegistry from '../../../base-player-government/PlayerGovernmentRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Settlers} from '../../../base-unit/Units.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

RulesRegistry.register(new Rule(
  'city:cost:food:base',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Effect((tileYield, city) => tileYield.subtract(city.size * 2))
));

[
  [1, Despotism, Anarchy],
  [2, Monarchy],
]
  .forEach(([multiplier, ...governments]) => {
    RulesRegistry.register(new Rule(
      `city:cost:food:activeSettlers:${governments.map((Government) => Government.name).join('-').toLowerCase()}`,
      new Criterion((tileYield) => tileYield instanceof Food),
      new Criterion((tileYield, city) => UnitRegistry.getBy('city', city)
        .some((unit) => unit instanceof Settlers && ! unit.destroyed)
      ),
      new Criterion((tileYield, city) => {
        const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', city.player);

        if (playerGovernment) {
          return playerGovernment.is(...governments);
        }

        return false;
      }),
      new Effect((tileYield, city) => tileYield.subtract(
        UnitRegistry.getBy('city', city)
          .filter((unit) => (unit instanceof Settlers) && ! unit.destroyed)
          .length *
        multiplier
      ))
    ));
  })
;

RulesRegistry.register(new Rule(
  'city:cost:production:base',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, city) => {
    const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', city.player);

    if (playerGovernment) {
      return playerGovernment.is(Despotism, Anarchy);
    }

    return false;
  }),
  // For units like Caravan/Diplomat, they could extend a FreeUnit class or something and these could be filtered out
  new Effect((tileYield, city) => {
    const supportedUnits = UnitRegistry.getBy('city', city)
      .length
    ;

    if (supportedUnits > city.size) {
      tileYield.subtract(supportedUnits - city.size);
    }
  })
));
