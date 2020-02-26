import CityRegistry from '../../../core-city/CityRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import {Irrigation} from '../../../base-tile-improvements/TileImprovements.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';
import Time from '../../../core-turn-based-game/Time.js';

RulesRegistry.register(new Rule(
  'city:destroyed:cleanup',
  new Effect((city, player) => {
    // remove irrigation - but keep the road for some reason
    const [irrigation] = TileImprovementRegistry.getBy('tile', city.tile)
      .filter((improvement) => improvement instanceof Irrigation)
    ;

    if (irrigation) {
      TileImprovementRegistry.unregister(irrigation);
    }

    city.destroyed = {
      turn: Time.turn,
      by: player,
    };

    CityRegistry.unregister(city);

    engine.emit('city:destroyed', city);
  })
));
