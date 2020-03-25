import * as Wonders from './Wonders.js';
import AvailableCityBuildItemsRegistry from '../base-city/AvailableCityBuildItemsRegistry.js';

AvailableCityBuildItemsRegistry.getInstance()
  .register(...Object.values(Wonders))
;
