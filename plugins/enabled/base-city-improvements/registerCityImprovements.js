import * as CityImprovements from './CityImprovements.js';
import AvailableCityBuildItemsRegistry from '../base-city/AvailableCityBuildItemsRegistry.js';

AvailableCityBuildItemsRegistry.getInstance()
  .register(...Object.values(CityImprovements))
;
