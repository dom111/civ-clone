import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Naval} from '../../Types.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  // new Rule(
  //   'city:build:unit:any',
  //   new Effect((city) => new Criterion(
  //     () => (city.production - city.units.length) > 0
  //   ))
  // ),

  new Rule(
    'city:build:unit:naval-unit',
    new Criterion((city, BuildItem) => Object.prototype.isPrototypeOf.call(Naval, BuildItem)),
    new Effect((city) => new Criterion(() => city.tile().isCoast()))
  ),
];

export default getRules;
