import Criterion from '../core-rules/Criterion.js';
import Rule from '../core-rules/Rule.js';
import Rules from '../core-rules/Rules.js';

Rules.register(new Rule(
  'city:build:improvement:any',
  new Criterion((city, buildItem) => ! city.improvements.some((improvement) => improvement instanceof buildItem))
));
