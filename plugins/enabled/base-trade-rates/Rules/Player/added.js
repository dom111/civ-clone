import {Research, Tax} from '../../TradeRates.js';
import AvailableTradeRateRegistry from '../../AvailableTradeRateRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerTradeRates from '../../PlayerTradeRates.js';
import PlayerTradeRatesRegistry from '../../PlayerTradeRatesRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'player:added:tradeRates',
  new Effect((player) => {
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
  })
));
