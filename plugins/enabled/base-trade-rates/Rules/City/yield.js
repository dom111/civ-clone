import AvailableTradeRateRegistry from '../../AvailableTradeRateRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerTradeRatesRegistry from '../../PlayerTradeRatesRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields.js';

export const getRules = ({
  availableTradeRateRegistry = AvailableTradeRateRegistry.getInstance(),
  playerTradeRatesRegistry = PlayerTradeRatesRegistry.getInstance(),
  rulesRegistry = RulesRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:yield:trade-rates',
    new Criterion((cityYield) => cityYield instanceof Trade),
    new Effect((cityYield, city, yields) => {
      const [playerRates] = playerTradeRatesRegistry.getBy('player', city.player());

      if (! playerRates) {
        throw new Error('fail');
      }

      availableTradeRateRegistry.entries()
        .forEach((TradeRate) => {
          let [tradeYield] = yields.filter((existingYield) => existingYield instanceof (TradeRate.tradeYield));

          if (! tradeYield) {
            tradeYield = new (TradeRate.tradeYield)();
            yields.push(tradeYield);
          }

          tradeYield.add(cityYield.value() * playerRates.get(TradeRate));

          rulesRegistry.process('city:yield', tradeYield, city, yields);
        })
      ;
    })
  ),
];

export default getRules;
