import {Courthouse, Palace} from '../../CityImprovements.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:build:improvement:any',
    new Effect((city, BuildItem) => new Criterion(
      () => ! cityImprovementRegistry.getBy('city', city)
        .some((improvement) => improvement instanceof BuildItem)
    ))
  ),

  ...[
    [Courthouse, Palace],
  ]
    .map(([Improvement, PreventedBy]) => new Rule(
      `city:build:improvement:${[Improvement, PreventedBy].map((Entity) => Entity.name.toLowerCase()).join(':')}`,
      new Criterion((city, BuildItem) => BuildItem === Improvement),
      new Effect((city) => new Criterion(
        () => ! cityImprovementRegistry.getBy('city', city)
          .some((improvement) => improvement instanceof PreventedBy)
      ))
    )),

  ...[
    // [Bank, Marketplace],
    // [University, Library],
  ]
    .map(([Improvement, ...Requires]) => new Rule(
      `city:build:improvement:${[Improvement, Requires].map((Entity) => Entity.name.toLowerCase()).join(':')}`,
      new Criterion((city, BuildItem) => BuildItem === Improvement),
      new Effect((city) => new Criterion(
        () => cityImprovementRegistry.getBy('city', city)
          .some((improvement) => Requires.some((Required) => improvement instanceof Required))
      ))
    )),
];

export default getRules;
