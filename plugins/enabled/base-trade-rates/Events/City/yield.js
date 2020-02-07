import AvailableTradeRateRegistry from '../../AvailableTradeRateRegistry.js';
import PlayerTradeRatesRegistry from '../../PlayerTradeRatesRegistry.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields.js';
import {YieldModifier} from '../../../core-yields/YieldModifier.js';

engine.on('city:yield', (cityYield, city) => {
  if (cityYield instanceof Trade) {
    const [playerRates] = PlayerTradeRatesRegistry.getBy('player', city.player);

    AvailableTradeRateRegistry.entries()
      .forEach((TradeRate) => {
        const tradeYield = new (TradeRate.tradeYield)(cityYield.value());

        tradeYield.addModifier(new YieldModifier((value) => value * playerRates.get(TradeRate)));

        engine.emit('city:yield', tradeYield, city);
      })
    ;
  }
});
