import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Food} from '../../base-yields/Yields.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import {Settlers} from '../../base-unit/Units.js';

RulesRegistry.register(new Rule(
  'city:cost:food:base',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Effect((tileYield, city) => tileYield.subtract(city.size * 2))
));
RulesRegistry.register(new Rule(
  '#city:cost:food:activeSettlers',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, city) => city.units.some((unit) => unit instanceof Settlers && ! unit.destroyed)),
  new Effect((tileYield, city) => tileYield.subtract(
    city.units.reduce((total, unit) => total + (unit instanceof Settlers && ! unit.destroyed) ? 1 : 0, 0)
  ))
));
