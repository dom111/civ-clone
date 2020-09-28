import {Research, Tax} from '../../TradeRates.js';
import AvailableTradeRateRegistry from '../../AvailableTradeRateRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerTradeRates from '../../PlayerTradeRates.js';
import PlayerTradeRatesRegistry from '../../PlayerTradeRatesRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  availableTradeRateRegistry = AvailableTradeRateRegistry.getInstance(),
  playerTradeRatesRegistry = PlayerTradeRatesRegistry.getInstance(),
} = {}) => [
  new Rule(
    'player:added:tradeRates',
    new Effect((player) => {
      const defaultRates = [
          new Tax(.5),
          new Research(.5),
        ],
        availableRates = availableTradeRateRegistry.entries(),
        playerTradeRates = new PlayerTradeRates(
          player,
          ...availableRates.map((TradeRate) => {
            const [defaultRate] = defaultRates.filter((rate) => rate instanceof TradeRate);

            return new TradeRate(defaultRate || 0);
          })
        )
      ;

      playerTradeRatesRegistry.register(playerTradeRates);
    })
  ),
];

export default getRules;
