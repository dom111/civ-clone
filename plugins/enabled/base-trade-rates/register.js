import {Science, Tax} from './TradeRates.js';
import AvailableTradeRateRegistry from './AvailableTradeRateRegistry.js';

[
  Science,
  Tax,
]
  .forEach((TradeRate) => AvailableTradeRateRegistry.register(TradeRate))
;