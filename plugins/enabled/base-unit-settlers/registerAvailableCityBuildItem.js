import AvailableCityBuildItemsRegistry from '../base-city/AvailableCityBuildItemsRegistry.js';
import Settlers from './Settlers.js';

AvailableCityBuildItemsRegistry.getInstance()
  .register(
    Settlers
  )
;
