import {Research, Tax} from './TradeRates.js';
import AvailableTradeRateRegistry from './AvailableTradeRateRegistry.js';

[
  Research,
  Tax,
]
  .forEach((TradeRate) => AvailableTradeRateRegistry.register(TradeRate))
;