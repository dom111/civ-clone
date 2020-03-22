import {Happiness, Unhappiness} from '../../Yields.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Luxuries} from '../../../base-luxuries/Yields.js';
import {Production} from '../../../base-terrain-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields.js';

export const getRules = ({
  rulesRegistry = RulesRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:cost:happiness:luxuries',
    new Criterion((cityYield) => cityYield instanceof Luxuries),
    new Effect((cityYield, city, yields) => {
      const [happiness] = yields.filter((cityYield) => cityYield instanceof Happiness);

      happiness.add(Math.floor(cityYield.value() / 2));
    })
  ),
  new Rule(
    'city:cost:unhappiness:base',
    new Criterion((cityYield) => cityYield instanceof Unhappiness),
    // TODO: factor in difficulty levels
    new Effect((cityYield, city) => cityYield.add(Math.max(city.size() - 5, 0)))
  ),
  new Rule(
    'city:cost:production:civil-disorder',
    new Criterion((cityYield) => cityYield instanceof Production),
    new Criterion((cityYield, city, yields) => rulesRegistry.get('city:civil-disorder')
      .some((rule) => rule.validate(city, yields))
    ),
    new Effect((cityYield) => cityYield.subtract(cityYield.value()))
  ),
  new Rule(
    'city:cost:trade:civil-disorder',
    new Criterion((cityYield) => cityYield instanceof Trade),
    new Criterion((cityYield, city, yields) => rulesRegistry.get('city:civil-disorder')
      .some((rule) => rule.validate(city, yields))
    ),
    new Effect((cityYield) => cityYield.subtract(cityYield.value()))
  ),
];

export default getRules;
