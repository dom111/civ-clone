import CityImprovementRegistry from '../../../core-registry/Registry.js';
import Courthouse from '../../Courthouse.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Palace from '../../../base-city-improvement-palace/Palace.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => [
  new Rule(
    `city:build:improvement:${[Courthouse, Palace].map((Entity) => Entity.name.toLowerCase()).join(':')}`,
    new Criterion((city, BuildItem) => BuildItem === Courthouse),
    new Effect((city) => new Criterion(
      () => ! cityImprovementRegistry.getBy('city', city)
        .some((improvement) => improvement instanceof Palace)
    ))
  ),
];

export default getRules;
