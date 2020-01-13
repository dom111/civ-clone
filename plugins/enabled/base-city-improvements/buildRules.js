import Criterion from '../core-rules/Criterion.js';
import Rule from '../core-rules/Rule.js';

Rule.register(new Rule(
  'city:build:improvement:any',
  new Criterion((city, buildItem) => ! city.improvements.some((improvement) => improvement instanceof buildItem))
));
