import AvailableCityBuildItemsRegistry from '../base-city/AvailableCityBuildItemsRegistry.js';
import Oracle from './Oracle.js';

AvailableCityBuildItemsRegistry.getInstance()
  .register(Oracle)
;
