import CityRegistry from '../../../core-city/CityRegistry.js';
import {Palace} from '../../Improvements/Palace.js';

engine.on('city:created', (city) => {
  if (! CityRegistry.getBy('player', city.player).length) {
    new Palace({
      city,
      player: city.player,
    });
  }
});
