// import {Barracks} from '../base-city-improvements/Improvements.js';
import {NavalUnit, Settlers} from '../Units.js';
import Criteria from '../../core-rules/Criteria.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
// import OneCriteria from '../../core-rules/OneCriteria.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';

// Rules.register(new Rule(
//   'city:build:unit:any',
//   new Effect((city) => new Criterion(
//     () => (city.production - city.units.length) > 0
//   ))
// ));
Rules.register(new Rule(
  'city:build:unit:settlers',
  new Criterion((city, buildItem) => buildItem === Settlers),
  new Effect((city) => new Criteria(
    new Criterion(() => city.size >= 2),
    new Criterion(() => city.surplusFood > 0)
  ))
));
Rules.register(new Rule(
  'city:build:unit:trireme',
  new Criterion((city, buildItem) => Object.prototype.isPrototypeOf.call(NavalUnit, buildItem)),
  new Effect((city, buildItem) => new Criteria(
    new Criterion(() => Object.prototype.isPrototypeOf.call(NavalUnit, buildItem)),
    new Criterion(() => city.tile.isCoast)
  ))
));

// on built
// For example:
// Rules.register(new Rule(
//   'unit:built:veteran',
//   new Criterion((unit, city) => city.hasImprovement(Barracks)),
//   new Effect((unit) => unit.improvements.push(new Veteran()))
// ));
Rules.register(new Rule(
  'city:building-complete:unit:settlers',
  new Criterion((city, unit) => unit instanceof Settlers),
  new Effect((city) => city && engine.emit('city:shrink', city))
));
