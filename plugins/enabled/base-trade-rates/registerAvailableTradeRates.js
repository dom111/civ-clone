import * as TradeRates from './TradeRates.js';
import AvailableTradeRateRegistry from './AvailableTradeRateRegistry.js';

AvailableTradeRateRegistry.getInstance()
  .register(...Object.values(TradeRates))
;
