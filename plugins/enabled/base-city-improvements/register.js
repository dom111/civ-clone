import {
  Aqueduct,
  Barracks,
  CityWalls,
  Colosseum,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Palace,
  Temple,
} from './CityImprovements.js';
import AvailableCityImprovementRegistry from '../core-city-improvement/AvailableCityImprovementRegistry.js';

[
  Aqueduct,
  Barracks,
  CityWalls,
  Colosseum,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Palace,
  Temple,
]
  .forEach((CityImprovement) => AvailableCityImprovementRegistry.register(CityImprovement))
;
