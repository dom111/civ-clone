import AvailableCityBuildItemsRegistry from '../base-city/AvailableCityBuildItemsRegistry.js';
import CityWalls from './CityWalls.js';

AvailableCityBuildItemsRegistry.getInstance()
  .register(
    CityWalls
  )
;
