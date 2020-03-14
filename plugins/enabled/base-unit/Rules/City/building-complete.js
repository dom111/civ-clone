import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import {Settlers} from '../../Units/Settlers.js';

export const getRules = () => [
  new Rule(
    'city:building-complete:unit:settlers',
    new Criterion((city, unit) => unit instanceof Settlers),
    new Effect((city) => city.shrink())
  ),
];

export default getRules;
