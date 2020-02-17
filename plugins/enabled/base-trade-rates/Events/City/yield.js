import AvailableTradeRateRegistry from '../../AvailableTradeRateRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import PlayerTradeRatesRegistry from '../../PlayerTradeRatesRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields.js';

RulesRegistry.register(new Rule(
  'city:yield:trade-rates',
  new Criterion((cityYield) => cityYield instanceof Trade),
  new Effect((cityYield, city, yields) => {
    const [playerRates] = PlayerTradeRatesRegistry.getBy('player', city.player);

    AvailableTradeRateRegistry.entries()
      .forEach((TradeRate) => {
        let [tradeYield] = yields.filter((existingYield) => existingYield instanceof (TradeRate.tradeYield));

        if (! tradeYield) {
          tradeYield = new (TradeRate.tradeYield)(cityYield.value() * playerRates.get(TradeRate));
          yields.push(tradeYield);
          // cityYield.subtract(tradeYield.value());
        }

        RulesRegistry.get('city:yield')
          .filter((rule) => rule.validate(tradeYield, city, yields))
          .forEach((rule) => rule.process(tradeYield, city, yields))
        ;
      })
    ;
  })
));