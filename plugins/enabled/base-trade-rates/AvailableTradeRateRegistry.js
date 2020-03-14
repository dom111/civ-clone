import Registry from '../core-registry/Registry.js';
import {TradeRate} from './TradeRate.js';

export class AvailableTradeRateRegistry extends Registry {
  constructor() {
    super(TradeRate);
  }
}

export default AvailableTradeRateRegistry;
