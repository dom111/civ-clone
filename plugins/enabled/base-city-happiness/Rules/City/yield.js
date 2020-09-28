import {High, Low} from '../../../core-rules/Priorities.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Production} from '../../../base-terrain-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields.js';
import {Unhappiness} from '../../Yields.js';

export const getRules = ({
  rulesRegistry = RulesRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:yield:unhappiness:base',
    new High(),
    new Criterion((cityYield) => cityYield instanceof Unhappiness),
    // TODO: factor in difficulty levels
    new Effect((cityYield, city) => cityYield.add(Math.max(city.size() - 5, 0)))
  ),
  new Rule(
    'city:yield:production:civil-disorder',
    new Low(),
    new Criterion((cityYield) => cityYield instanceof Production),
    new Criterion((cityYield, city, yields) => rulesRegistry.get('city:civil-disorder')
      .some((rule) => rule.validate(city, yields))
    ),
    new Effect((cityYield) => cityYield.set(0))
  ),
  new Rule(
    'city:yield:trade:civil-disorder',
    new Low(),
    new Criterion((cityYield) => cityYield instanceof Trade),
    new Criterion((cityYield, city, yields) => rulesRegistry.get('city:civil-disorder')
      .some((rule) => rule.validate(city, yields))
    ),
    new Effect((cityYield) => cityYield.set(0))
  ),
];

export default getRules;
