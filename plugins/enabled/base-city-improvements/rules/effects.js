import {Barracks, CityWalls, Granary} from '../Improvements.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import {Veteran} from '../../base-unit-improvements/Improvements.js';

RulesRegistry.register(new Rule(
  'unit:created:veteran',
  new Criterion((unit) => unit.city && unit.city.improvements.some((improvement) => improvement instanceof Barracks)),
  new Effect((unit) => unit.improvements.push(new Veteran()))
));
RulesRegistry.register(new Rule(
  'city:grow:granary',
  new Criterion((city) => city.improvements.some((improvement) => improvement instanceof Granary)),
  new Effect((city) => city.foodStorage = 5 + (city.size * 5))
));
RulesRegistry.register(new Rule(
  'unit:combat:defence:city-walls',
  new Criterion((unit) => unit.tile.city && unit.tile.city.improvements.some((improvement) => improvement instanceof CityWalls)),
  new Effect((unit) => unit.defence * 2)
));