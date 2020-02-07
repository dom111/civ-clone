import AvailableTradeRateRegistry from '../../AvailableTradeRateRegistry.js';
import {PlayerTradeRates} from '../../PlayerTradeRates.js';
import PlayerTradeRatesRegistry from '../../PlayerTradeRatesRegistry.js';

engine.on('player:added', (player) => {
  const availableRates = AvailableTradeRateRegistry.entries(),
    playerTradeRates = new PlayerTradeRates(
      player,
      ...availableRates.map((TradeRate) => new TradeRate(1 / availableRates.length))
    )
  ;

  PlayerTradeRatesRegistry.register(playerTradeRates);
});
