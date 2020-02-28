import CityBuildRegistry from './CityBuildRegistry.js';
import CityRegistry from '../core-city/CityRegistry.js';
import PlayerActionProvider from '../core-player/PlayerActionProvider.js';
import PlayerActionRegistry from '../core-player/PlayerActionRegistry.js';

PlayerActionRegistry.register(new PlayerActionProvider((player) => CityRegistry.getBy('player', player)
  .flatMap((city) => CityBuildRegistry.getBy('city', city))
  .filter((cityBuild) => ! cityBuild.building())
));
