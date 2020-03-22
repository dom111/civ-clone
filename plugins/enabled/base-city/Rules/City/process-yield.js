import {Food, Production} from '../../../base-terrain-yields/Yields.js';
import CityBuildRegistry from '../../CityBuildRegistry.js';
import CityGrowthRegistry from '../../CityGrowthRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

export const getRules = ({
  cityBuildRegistry = CityBuildRegistry.getInstance(),
  cityGrowthRegistry = CityGrowthRegistry.getInstance(),
  unitRegistry = UnitRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:process-yield:food',
    new Criterion((cityYield) => cityYield instanceof Food),
    new Effect((cityYield, city) => cityGrowthRegistry.getBy('city', city)
      .forEach((cityGrowth) => {
        cityGrowth.add(cityYield);
        cityGrowth.check();
      })
    )
  ),
  new Rule(
    'city:process-yield:production:positive',
    new Criterion((cityYield) => cityYield instanceof Production),
    new Criterion((cityYield) => cityYield.value() >= 0),
    new Effect((cityYield, city) => cityBuildRegistry.getBy('city', city)
      .forEach((cityBuild) => {
        cityBuild.add(cityYield);
        cityBuild.check();
      })
    )
  ),
  new Rule(
    'city:process-yield:production:negative',
    new Criterion((cityYield) => cityYield instanceof Production),
    new Criterion((cityYield) => cityYield.value() < 0),
    new Effect((cityYield, city) => unitRegistry.getBy('city', city)
      .sort((a, b) => a.tile().distanceFrom(city.tile()) - b.tile().distanceFrom(city.tile()))
      .slice(cityYield.value())
      .forEach((unit) => unit.destroy())
    )
  ),
];

export default getRules;
