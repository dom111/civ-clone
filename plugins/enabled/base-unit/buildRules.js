// import {Barracks} from '../base-city-improvements/Improvements.js';
import {Settlers, Trireme} from './Units.js';
import Criteria from '../core-rules/Criteria.js';
import Criterion from '../core-rules/Criterion.js';
import Effect from '../core-rules/Effect.js';
import OneCriteria from '../core-rules/OneCriteria.js';
import Rule from '../core-rules/Rule.js';
import Rules from '../core-rules/Rules.js';

// TODO: this sucks, need to change this.
// Rules.register(new Rule(
//   'city:build:unit:any',
//   new Criterion((city) => (city.production - city.units.length) > 0)
// ));
Rules.register(new Rule(
  'city:build:unit:settlers',
  new OneCriteria(
    new Criterion((city, buildItem) => buildItem !== Settlers),
    new Criteria(
      new Criterion((city, buildItem) => buildItem === Settlers),
      new Criterion((city) => city.size >= 2),
      new Criterion((city) => city.surplusFood > 0)
    )
  )
));
Rules.register(new Rule(
  'city:build:unit:trireme',
  new OneCriteria(
    new Criterion((city, buildItem) => buildItem !== Trireme),
    new Criteria(
      new Criterion((city, buildItem) => buildItem === Trireme),
      new Criterion((city) => city.tile.isCoast)
    )
  )
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
