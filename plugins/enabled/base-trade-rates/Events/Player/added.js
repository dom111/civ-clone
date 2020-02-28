import {Research, Tax} from '../../TradeRates.js';
import AvailableTradeRateRegistry from '../../AvailableTradeRateRegistry.js';
import {PlayerTradeRates} from '../../PlayerTradeRates.js';
import PlayerTradeRatesRegistry from '../../PlayerTradeRatesRegistry.js';

engine.on('player:added', (player) => {
  // TODO: rules!
  const defaultRates = [
      new Tax(.5),
      new Research(.5),
    ],
    availableRates = AvailableTradeRateRegistry.entries(),
    playerTradeRates = new PlayerTradeRates(
      player,
      ...availableRates.map((TradeRate) => {
        const [defaultRate] = defaultRates.filter((rate) => rate instanceof TradeRate);

        return new TradeRate(defaultRate || 0);
      })
    )
  ;

  PlayerTradeRatesRegistry.register(playerTradeRates);
});
