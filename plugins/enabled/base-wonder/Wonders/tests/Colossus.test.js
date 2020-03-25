import {Colossus} from '../../Wonders.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';
import assert from 'assert';
import cityYield from '../../Rules/City/yield.js';
import setUpCity from '../../../base-city/tests/lib/setUpCity.js';
import tileYield from '../../../base-terrain-yield-trade/Rules/Tile/yield.js';

describe('Colossus', () => {
  it('should provide one additional trade per tile with trade already on in the city that builds it', () => {
    const rulesRegistry = new RulesRegistry(),
      wonderRegistry = new WonderRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      city = setUpCity({
        rulesRegistry,
        size: 5,
        tileImprovementRegistry,
      })
    ;

    rulesRegistry.register(
      ...cityYield({
        wonderRegistry,
      }),
      ...tileYield({
        tileImprovementRegistry,
      })
    );

    const [tradeYield] = city.yields({
      yields: [Trade],
    });

    assert.strictEqual(tradeYield.value(), 6);

    wonderRegistry.register(new Colossus({
      city,
      rulesRegistry,
    }));

    const [updatedTradeYield] = city.yields({
      yields: [Trade],
    });

    assert.strictEqual(updatedTradeYield.value(), 12);
  });
});
