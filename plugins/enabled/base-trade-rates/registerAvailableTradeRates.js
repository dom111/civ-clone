import {Research, Tax} from './TradeRates.js';
import AvailableTradeRateRegistry from './AvailableTradeRateRegistry.js';

AvailableTradeRateRegistry.getInstance()
  .register(
    Research,
    Tax
  )
;