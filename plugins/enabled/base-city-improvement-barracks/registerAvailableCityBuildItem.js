import AvailableCityBuildItemsRegistry from '../base-city/AvailableCityBuildItemsRegistry.js';
import Barracks from './Barracks.js';

AvailableCityBuildItemsRegistry.getInstance()
  .register(
    Barracks
  )
;
