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

AvailableCityImprovementRegistry.getInstance()
  .register(...[
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
  ])
;
