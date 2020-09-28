import {CityBuild} from '../../PlayerActions.js';
import CityBuildRegistry from '../../CityBuildRegistry.js';
import CityRegistry from '../../../core-city/CityRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityBuildRegistry = CityBuildRegistry.getInstance(),
  cityRegistry = CityRegistry.getInstance(),
} = {}) => {
  return [
    new Rule(
      'player:action:city-build',
      new Criterion((player) => cityRegistry.getBy('player', player)
        .flatMap((city) => cityBuildRegistry.getBy('city', city))
        .some((cityBuild) => ! cityBuild.building())
      ),
      new Effect((player) => cityRegistry.getBy('player', player)
        .flatMap((city) => cityBuildRegistry.getBy('city', city))
        .filter((cityBuild) => ! cityBuild.building())
        .map((cityBuild) => new CityBuild(cityBuild))
      )
    ),
  ];
};

export default getRules;
