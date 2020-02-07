import CityRegistry from '../../../core-city/CityRegistry.js';
import {Palace} from '../../Improvements/Palace.js';

engine.on('city:created', (city) => {
  const existingCities = CityRegistry.getBy('player', city.player);

  if (! existingCities.length) {
    city.improvements.push(new Palace());
  }
});
