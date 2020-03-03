import {Courthouse, Palace} from '../../CityImprovements.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:build:improvement:any',
  new Effect((city, BuildItem) => new Criterion(
    () => ! CityImprovementRegistry.getBy('city', city)
      .some((improvement) => improvement instanceof BuildItem)
  ))
));

[
  [Courthouse, Palace],
]
  .forEach(([Improvement, PreventedBy]) => RulesRegistry.register(new Rule(
    `city:build:improvement:${[Improvement, PreventedBy].map((Entity) => Entity.name.toLowerCase()).join(':')}`,
    new Criterion((city, BuildItem) => BuildItem === Improvement),
    new Effect((city) => new Criterion(
      () => ! CityImprovementRegistry.getBy('city', city)
        .some((improvement) => improvement instanceof PreventedBy)
    ))
  )))
;

[
  // [Bank, Marketplace],
  // [University, Library],
]
  .forEach(([Improvement, ...Requires]) => RulesRegistry.register(new Rule(
    `city:build:improvement:${[Improvement, Requires].map((Entity) => Entity.name.toLowerCase()).join(':')}`,
    new Criterion((city, BuildItem) => BuildItem === Improvement),
    new Effect((city) => new Criterion(
      () => CityImprovementRegistry.getBy('city', city)
        .some((improvement) => Requires.some((Required) => improvement instanceof Required))
    ))
  )))
;
