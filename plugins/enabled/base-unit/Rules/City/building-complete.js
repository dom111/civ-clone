import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Settlers} from '../../Units/Settlers.js';

RulesRegistry.register(new Rule(
  'city:building-complete:unit:settlers',
  new Criterion((city, unit) => unit instanceof Settlers),
  new Effect((city) => city.shrink())
));
