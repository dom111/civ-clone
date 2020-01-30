import {Barracks, CityWalls, Courthouse, Granary, Library, Palace, Temple} from './Improvements.js';
import CityImprovementRegistry from '../core-city-improvement/Registry.js';

[
  Barracks,
  CityWalls,
  Courthouse,
  Granary,
  Library,
  Palace,
  Temple,
]
  .forEach((CityImprovement) => CityImprovementRegistry.register(CityImprovement))
;
