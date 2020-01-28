import {Fortified, Veteran} from '../../base-unit-improvements/Improvements.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';

Rules.register(new Rule(
  'unit:combat:defence:fortified',
  new Criterion((unit) => unit.improvements.some((improvement) => improvement instanceof Fortified)),
  new Effect((unit) => unit.defence)
));
Rules.register(new Rule(
  'unit:combat:attack:veteran',
  new Criterion((unit) => unit.improvements.some((improvement) => improvement instanceof Veteran)),
  new Effect((unit) => unit.attack * .5)
));
Rules.register(new Rule(
  'unit:combat:defence:veteran',
  new Criterion((unit) => unit.improvements.some((improvement) => improvement instanceof Veteran)),
  new Effect((unit) => unit.defence * .5)
));
