import CityRegistry from '../../../core-city/CityRegistry.js';
import {Irrigation} from '../../../base-terrain-improvements/Improvements.js';
import Time from '../../../core-turn-based-game/Time.js';

engine.on('city:destroyed', (city, player) => {
  // remove irrigation - but keep the road for some reason
  const [irrigation] = city.tile.improvements.filter((improvement) => improvement instanceof Irrigation);

  if (irrigation) {
    city.tile.improvements.splice(city.tile.improvements.indexOf(irrigation), 1);
  }

  city.destroyed = {
    turn: Time.turn,
    by: player,
  };

  CityRegistry.unregister(city);
});
