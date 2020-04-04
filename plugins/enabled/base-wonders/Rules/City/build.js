import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Wonder from '../../../core-wonder/Wonder.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';

export const getRules = ({
  wonderRegistry = WonderRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:build:wonder:any',
    new Criterion((city, BuildItem) => Object.isPrototypeOf.call(Wonder, BuildItem)),
    new Effect((city, Wonder) => new Criterion(
      () => wonderRegistry.filter((wonder) => wonder instanceof Wonder)
        .length === 0
    ))
  ),
];

export default getRules;
