import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = (CityImprovement, cost) => [
  new Rule(
    `city:build-cost:${CityImprovement.name.toLowerCase()}`,
    new Criterion((Entity) => Entity === CityImprovement),
    new Effect(() => cost)
  ),
];

export default getRules;
