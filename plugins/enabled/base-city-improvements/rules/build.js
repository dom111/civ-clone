import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:build:improvement:any',
  new Effect((city, BuildItem) => new Criterion(
    () => ! city.improvements.some((improvement) => improvement instanceof BuildItem)
  ))
));
