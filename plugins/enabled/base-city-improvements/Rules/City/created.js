import CityRegistry from '../../../core-city/CityRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Palace} from '../../CityImprovements/Palace.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'city:created:improvements:palace',
  new Criterion((city) => ! CityRegistry.getBy('player', city.player).length),
  new Effect((city) => new Palace({
    city,
    player: city.player,
  }))
));
