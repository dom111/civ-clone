import {Fortified, Veteran} from './Improvements.js';
import Criterion from '../core-rules/Criterion.js';
import Effect from '../core-rules/Effect.js';
import Rule from '../core-rules/Rule.js';

new Rule(
  'unit:combat:defence:fortified',
  new Criterion((unit) => unit.improvements.some((improvement) => improvement instanceof Fortified)),
  new Effect((unit) => unit.defence)
);
new Rule(
  'unit:combat:attack:veteran',
  new Criterion((unit) => unit.improvements.some((improvement) => improvement instanceof Veteran)),
  new Effect((unit) => unit.attack * .5)
);
new Rule(
  'unit:combat:defence:veteran',
  new Criterion((unit) => unit.improvements.some((improvement) => improvement instanceof Veteran)),
  new Effect((unit) => unit.defence * .5)
);
