import {Barracks, CityWalls, Granary} from './Improvements.js';
import CityImprovementRegistry from '../core-city-improvement/Registry.js';

[
  Barracks,
  CityWalls,
  Granary,
]
  .forEach((CityImprovement) => CityImprovementRegistry.register(CityImprovement))
;
