import {
  Barracks,
  CityWalls,
  Courthouse,
  Granary,
  Library,
  Palace,
  Temple,
} from './Improvements.js';
import AvailableCityImprovementRegistry from '../core-city-improvement/AvailableCityImprovementRegistry.js';

[
  Barracks,
  CityWalls,
  Courthouse,
  Granary,
  Library,
  Palace,
  Temple,
]
  .forEach((CityImprovement) => AvailableCityImprovementRegistry.register(CityImprovement))
;
