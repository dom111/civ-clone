import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';

Rules.register(new Rule(
  'city:build:improvement:any',
  new Effect((city, buildItem) => new Criterion(
    () => ! city.improvements.some((improvement) => improvement instanceof buildItem)
  ))
));
