import CityRegistry from '../../../core-city/CityRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import {Irrigation} from '../../../base-tile-improvements/TileImprovements.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

RulesRegistry.register(new Rule(
  'city:destroyed:tile-improvements-removal',
  new Effect((city) => TileImprovementRegistry.getBy('tile', city.tile)
    .filter((improvement) => improvement instanceof Irrigation)
    .forEach((irrigation) => TileImprovementRegistry.unregister(irrigation))
  )
));

RulesRegistry.register(new Rule(
  'city:destroyed:unregister',
  new Effect((city) => CityRegistry.unregister(city))
));

RulesRegistry.register(new Rule(
  'city:destroyed:event',
  new Effect((city, player) => engine.emit('city:destroyed', city, player))
));
