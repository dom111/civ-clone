import CityImprovementRegistry from '../../CityImprovementRegistry.js';

engine.on('city-improvement:created', (cityImprovement) => {
  CityImprovementRegistry.register(cityImprovement);
});
