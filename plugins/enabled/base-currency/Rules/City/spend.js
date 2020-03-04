import CityImprovement from '../../../core-city-improvement/CityImprovement.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import Unit from '../../../core-unit/Unit.js';

// From: https://forums.civfanatics.com/threads/buy-unit-building-wonder-price.576026/
RulesRegistry.register(new Rule(
  'city:spend:unit:no-progress',
  new Criterion((cityBuild) => Object.isPrototypeOf.call(Unit, cityBuild.building())),
  new Criterion((cityBuild) => cityBuild.progress.value() === 0),
  new Effect((cityBuild, cost) => {
    const price = cityBuild.remaining() / 10;

    cost.add(Math.floor((price + 4) * 10 * price));
  })
));

RulesRegistry.register(new Rule(
  'city:spend:unit:some-progress',
  new Criterion((cityBuild) => Object.isPrototypeOf.call(Unit, cityBuild.building())),
  new Criterion((cityBuild) => cityBuild.progress.value() > 0),
  new Effect((cityBuild, cost) => {
    const price = cityBuild.remaining() / 10;

    cost.add(Math.floor((5 * (price ** 2)) + (20 * price)));
  })
));

RulesRegistry.register(new Rule(
  'city:spend:city-improvement:no-progress',
  new Criterion((cityBuild) => Object.isPrototypeOf.call(CityImprovement, cityBuild.building())),
  new Criterion((cityBuild) => cityBuild.progress.value() === 0),
  new Effect((cityBuild, cost) => cost.add(cityBuild.remaining() * 4))
));

RulesRegistry.register(new Rule(
  'city:spend:city-improvement:some-progress',
  new Criterion((cityBuild) => Object.isPrototypeOf.call(CityImprovement, cityBuild.building())),
  new Criterion((cityBuild) => cityBuild.progress.value() > 0),
  new Effect((cityBuild, cost) => cost.add(cityBuild.remaining() * 2))
));
