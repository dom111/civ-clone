import * as Units from './Units.js';
import AvailableCityBuildItemsRegistry from '../base-city/AvailableCityBuildItemsRegistry.js';

AvailableCityBuildItemsRegistry.getInstance()
  .register(...Object.values(Units))
;
