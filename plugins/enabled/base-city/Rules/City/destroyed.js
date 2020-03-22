import CityRegistry from '../../../core-city/CityRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import {Irrigation} from '../../../base-tile-improvements/TileImprovements.js';
import Rule from '../../../core-rules/Rule.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

export const getRules = ({
  tileImprovementRegistry = TileImprovementRegistry.getInstance(),
  cityRegistry = CityRegistry.getInstance(),
  // engine = engine,
} = {}) => [
  new Rule(
    'city:destroyed:tile-improvements-removal',
    new Effect((city) => tileImprovementRegistry.getBy('tile', city.tile())
      .filter((improvement) => improvement instanceof Irrigation)
      .forEach((irrigation) => tileImprovementRegistry.unregister(irrigation))
    )
  ),
  new Rule(
    'city:destroyed:unregister',
    new Effect((city) => cityRegistry.unregister(city))
  ),
  new Rule(
    'city:destroyed:event',
    new Effect((city, player) => engine.emit('city:destroyed', city, player))
  ),
];

export default getRules;
