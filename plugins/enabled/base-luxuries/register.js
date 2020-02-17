import AvailableTradeRateRegistry from '../base-trade-rates/AvailableTradeRateRegistry.js';
import {Luxuries} from './TradeRates.js';

[
  Luxuries,
]
  .forEach((TradeRate) => AvailableTradeRateRegistry.register(TradeRate))
;
