import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Library} from '../../../base-city-improvements/CityImprovements.js';
import {Library as LibraryModifier} from '../../YieldModifier/Library.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Science} from '../../../base-science/Yields.js';

[
  [Library, Science, LibraryModifier],
]
  .forEach(([Improvment, Yield, YieldModifier]) => {
    RulesRegistry.register(new Rule(
      `city:yield:${[Yield, Improvment].map((Entity) => Entity.name).join(':')}`,
      new Criterion((cityYield) => cityYield instanceof Yield),
      new Criterion((cityYield, city) => CityImprovementRegistry.getBy('city', city)
        .some((improvement) => improvement instanceof Improvment)
      ),
      new Effect((cityYield) => cityYield.addModifier(new YieldModifier()))
    ));
  })
;
