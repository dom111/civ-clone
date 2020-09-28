import AvailableCityBuildItemsRegistry from '../base-city/AvailableCityBuildItemsRegistry.js';
import Marketplace from './Marketplace.js';

AvailableCityBuildItemsRegistry.getInstance()
  .register(
    Marketplace
  )
;
