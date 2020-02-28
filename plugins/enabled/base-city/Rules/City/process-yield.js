import {Food, Production} from '../../../base-terrain-yields/Yields.js';
import CityBuildRegistry from '../../CityBuildRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

RulesRegistry.register(new Rule(
  'city:process-yield:food',
  new Criterion((cityYield) => cityYield instanceof Food),
  new Effect((cityYield, city) => {
    city.foodStorage += cityYield.value();

    RulesRegistry.get('city:growth')
      .filter((rule) => rule.validate(city))
      .forEach((rule) => rule.process(city))
    ;
  })
));

RulesRegistry.register(new Rule(
  'city:process-yield:production:positive',
  new Criterion((cityYield) => cityYield instanceof Production),
  new Criterion((cityYield) => cityYield.value() >= 0),
  new Effect((cityYield, city) => CityBuildRegistry.getBy('city', city)
    .forEach((cityBuild) => {
      cityBuild.add(cityYield);
      cityBuild.check();
    })
  )
));

RulesRegistry.register(new Rule(
  'city:process-yield:production:negative',
  new Criterion((cityYield) => cityYield instanceof Production),
  new Criterion((cityYield) => cityYield.value() < 0),
  new Effect((cityYield, city) => UnitRegistry.getBy('city', city)
    .sort((a, b) => a.tile.distanceFrom(city.tile) - b.tile.distanceFrom(city.tile))
    .slice(cityYield.value())
    .forEach((unit) => unit.destroy())
  )
));
