import AvailableTradeRateRegistry from '../base-trade-rates/AvailableTradeRateRegistry.js';
import {Luxuries} from './TradeRates.js';

AvailableTradeRateRegistry.getInstance()
  .register(Luxuries)
;
