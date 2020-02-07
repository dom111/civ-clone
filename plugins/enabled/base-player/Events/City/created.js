import CityRegistry from '../../../core-city/CityRegistry.js';

engine.on('city:created', (city) => {
  CityRegistry.register(city);
});
