import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Happiness} from '../../Yields.js';
import {Luxuries} from '../../../base-luxuries/Yields.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'city:cost:happiness:luxuries',
    new Criterion((cityYield) => cityYield instanceof Luxuries),
    new Effect((cityYield, city, yields) => {
      const [happiness] = yields.filter((cityYield) => cityYield instanceof Happiness);

      happiness.add(Math.floor(cityYield.value() / 2));
    })
  ),
];

export default getRules;
