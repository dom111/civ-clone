import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = (Wonder, cost) => [
  new Rule(
    `city:build-cost:${Wonder.name.toLowerCase()}`,
    new Criterion((constructor) => constructor === Wonder),
    new Effect(() => cost)
  ),
];

export default getRules;
