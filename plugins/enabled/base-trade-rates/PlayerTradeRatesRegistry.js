import PlayerTradeRates from './PlayerTradeRates.js';
import Registry from '../core-registry/Registry.js';

export class PlayerTradeRatesRegistry extends Registry {
  constructor() {
    super(PlayerTradeRates);
  }
}

export default PlayerTradeRatesRegistry;
