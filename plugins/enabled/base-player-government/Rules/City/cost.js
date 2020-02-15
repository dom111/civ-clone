import {Anarchy, Despotism, Monarchy} from '../../../base-governments/Governments.js';
import {Food, Production} from '../../../base-terrain-yields/Yields.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Settlers} from '../../../base-unit/Units.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

[
  [Food, 'settlers', (tileYield, city) => {
    tileYield.subtract(UnitRegistry.getBy('city', city)
      .filter((unit) => unit instanceof Settlers && ! unit.destroyed)
      .length
    );
  }, Anarchy, Despotism],
  [Food, 'settlers', (tileYield, city) => {
    // For units like Caravan/Diplomat, they could extend a FreeUnit class or something and these could be filtered out
    const supportedUnits = UnitRegistry.getBy('city', city)
      .filter((unit) => unit instanceof Settlers && ! unit.destroyed)
      .length
    ;

    tileYield.subtract(supportedUnits * 2);
  }, Monarchy],
  [Production, 'unit', (tileYield, city) => {
    // For units like Caravan/Diplomat, they could extend a FreeUnit class or something and these could be filtered out
    const supportedUnits = UnitRegistry.getBy('city', city)
      .length
    ;

    if (supportedUnits > city.size) {
      tileYield.subtract(supportedUnits - city.size);
    }
  }, Anarchy, Despotism],
  [Production, 'unit', (tileYield, city) => {
    // For units like Caravan/Diplomat, they could extend a FreeUnit class or something and these could be filtered out
    tileYield.subtract(UnitRegistry.getBy('city', city)
      .length
    );
  }, Monarchy],
]
  .forEach(([Yield, type, effect, ...Governments]) => {
    RulesRegistry.register(new Rule(
      `city:cost:${[Yield.name]}:${type}:${Governments.map((Entity) => Entity.name).join('-')}`,
      new Criterion((tileYield) => tileYield instanceof Yield),
      new Criterion((tileYield, city) => {
        const [playerGovernment] = PlayerGovernmentRegistry.getBy('player', city.player);

        if (playerGovernment) {
          return playerGovernment.is(...Governments);
        }

        return false;
      }),
      new Effect(effect)
    ));
  })
;
