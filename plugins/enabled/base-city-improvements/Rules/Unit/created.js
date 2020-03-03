import {Barracks} from '../../CityImprovements.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import UnitImprovementRegistry from '../../../base-unit-improvements/UnitImprovementRegistry.js';
import {Veteran} from '../../../base-unit-improvements/UnitImprovements.js';

RulesRegistry.register(new Rule(
  'unit:created:veteran',
  new Criterion((unit) => unit.city && CityImprovementRegistry.getBy('city', unit.city)
    .some((improvement) => improvement instanceof Barracks)
  ),
  new Effect((unit) => UnitImprovementRegistry.register(new Veteran(unit)))
));
