import {Barracks, CityWalls} from '../../Improvements.js';
import CityRegistry from '../../../core-city/CityRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Veteran} from '../../../base-unit-improvements/Improvements.js';

RulesRegistry.register(new Rule(
  'unit:created:veteran',
  new Criterion((unit) => unit.city && unit.city.improvements.some((improvement) => improvement instanceof Barracks)),
  new Effect((unit) => unit.improvements.push(new Veteran()))
));
RulesRegistry.register(new Rule(
  'unit:combat:defence:city-walls',
  new Criterion((unit) => {
    const [city] = CityRegistry.getBy('tile', unit.tile);

    return city && city.improvements.some((improvement) => improvement instanceof CityWalls);
  }),
  new Effect((unit) => unit.defence * 2)
));
