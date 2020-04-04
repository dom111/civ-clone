import AvailableTradeRateRegistry from '../../base-trade-rates/AvailableTradeRateRegistry.js';
import CopernicusObservatory from '../CopernicusObservatory.js';
import PlayerTradeRates from '../../base-trade-rates/PlayerTradeRates.js';
import PlayerTradeRatesRegistry from '../../base-trade-rates/PlayerTradeRatesRegistry.js';
import {Research} from '../../base-science/Yields.js';
import {Research as ResearchRate} from '../../base-trade-rates/TradeRates.js';
import RulesRegistry from '../../core-rules-registry/RulesRegistry.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';
import {Trade} from '../../base-terrain-yield-trade/Yields/Trade.js';
import WonderRegistry from '../../core-wonder/WonderRegistry.js';
import assert from 'assert';
import cityRatesYield from '../../base-trade-rates/Rules/City/yield.js';
import cityYield from '../Rules/City/yield.js';
import setUpCity from '../../base-city/tests/lib/setUpCity.js';
import tileTradeYield from '../../base-terrain-yield-trade/Rules/Tile/yield.js';

describe('CopernicusObservatory', () => {
  it('should double the Research production in the city', () => {
    const rulesRegistry = new RulesRegistry(),
      wonderRegistry = new WonderRegistry(),
      availableTradeRateRegistry = new AvailableTradeRateRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      city = setUpCity({
        rulesRegistry,
        size: 5,
        tileImprovementRegistry,
      }),
      playerTradeRates = new PlayerTradeRates(city.player(), new ResearchRate(1)),
      playerTradeRatesRegistry = new PlayerTradeRatesRegistry()
    ;

    rulesRegistry.register(
      ...cityYield({
        wonderRegistry,
      }),
      ...tileTradeYield({
        tileImprovementRegistry,
      }),
      ...cityRatesYield({
        availableTradeRateRegistry,
        playerTradeRatesRegistry,
        rulesRegistry,
      })
    );
    availableTradeRateRegistry.register(ResearchRate);
    playerTradeRatesRegistry.register(playerTradeRates);

    const [researchYield] = city.yields({
      yields: [Trade, Research],
    })
      .filter((cityYield) => cityYield instanceof Research)
    ;

    assert.strictEqual(researchYield.value(), 6);

    wonderRegistry.register(new CopernicusObservatory({
      city,
      rulesRegistry,
    }));

    const [updatedResearchYield] = city.yields({
      yields: [Trade, Research],
    })
      .filter((cityYield) => cityYield instanceof Research)
    ;

    assert.strictEqual(updatedResearchYield.value(), 12);
  });
});
