import CityBuildRegistry from '../../../base-city/CityBuildRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Wonder from '../../../core-wonder/Wonder.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';

export const getRules = ({
  cityBuildRegistry = CityBuildRegistry.getInstance(),
  wonderRegistry = WonderRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:building-complete:wonder',
    new Criterion((cityBuild, built) => built instanceof Wonder),
    new Effect((cityBuild, built) => {
      const Wonder = built.constructor;

      wonderRegistry.register(built);
      cityBuildRegistry.filter((cityBuild) => cityBuild.building() === Wonder)
        .forEach((cityBuild) => cityBuild.revalidate())
      ;
    })
  ),
];

export default getRules;
