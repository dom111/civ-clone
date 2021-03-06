import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Lighthouse from '../../Lighthouse.js';
import {Low} from '../../../core-rules/Priorities.js';
import {Movement} from '../../../core-unit/Yields.js';
import {Naval} from '../../../base-unit/Types.js';
import Rule from '../../../core-rules/Rule.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';

export const getRules = ({
  wonderRegistry = WonderRegistry.getInstance(),
} = {}) => [
  new Rule(
    'unit:yield:movement:naval-unit:lighthouse',
    new Low(),
    new Criterion((unit, unitYield) => unitYield instanceof Movement),
    new Criterion((unit) => unit instanceof Naval),
    new Criterion((unit) => wonderRegistry.filter((wonder) => wonder instanceof Lighthouse)
      .some((wonder) => wonder.player() === unit.player())
    ),
    new Effect((unit, unitYield) => unitYield.add(1))
  ),
];

export default getRules;
