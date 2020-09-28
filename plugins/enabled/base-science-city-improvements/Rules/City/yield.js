import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Library} from '../../../base-city-improvements-civ1/CityImprovements.js';
import {Library as LibraryModifier} from '../../YieldModifier/Library.js';
import {Research} from '../../../base-science/Yields.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => [
  ...[
    [Library, Research, LibraryModifier],
  ]
    .map(([Improvment, Yield, YieldModifier]) => new Rule(
      `city:yield:${[Yield, Improvment].map((Entity) => Entity.name).join(':')}`,
      new Criterion((cityYield) => cityYield instanceof Yield),
      new Criterion((cityYield, city) => cityImprovementRegistry.getBy('city', city)
        .some((improvement) => improvement instanceof Improvment)
      ),
      new Effect((cityYield) => cityYield.addModifier(new YieldModifier()))
    ))
  ,
];

export default getRules;
