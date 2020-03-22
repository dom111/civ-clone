import Criteria from '../../../core-rules/Criteria.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {NavalUnit} from '../../Types.js';
import Rule from '../../../core-rules/Rule.js';
import {Settlers} from '../../Units.js';

export const getRules = () => [
  // new Rule(
  //   'city:build:unit:any',
  //   new Effect((city) => new Criterion(
  //     () => (city.production - city.units.length) > 0
  //   ))
  // ),
  new Rule(
    'city:build:unit:settlers',
    new Criterion((city, buildItem) => buildItem === Settlers),
    new Effect((city) => new Criteria(
      new Criterion(() => city.size() >= 2)
      // new Criterion(() => city.surplusFood > 0)
    ))
  ),

  new Rule(
    'city:build:unit:naval-unit',
    new Criterion((city, buildItem) => Object.prototype.isPrototypeOf.call(NavalUnit, buildItem)),
    new Effect((city) => new Criteria(
      new Criterion(() => city.tile().isCoast())
    ))
  ),
];

export default getRules;
