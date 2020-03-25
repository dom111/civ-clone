import AdvanceRegistry from '../../../core-science/AdvanceRegistry.js';
import {HangingGardens} from '../../Wonders.js';
import {Happiness} from '../../../base-city-happiness/Yields.js';
import {Invention} from '../../../base-science/Advances/Invention.js';
import PlayerResearch from '../../../base-science/PlayerResearch.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';
import assert from 'assert';
import cityYield from '../../Rules/City/yield.js';
import setUpCity from '../../../base-city/tests/lib/setUpCity.js';
import tileYield from '../../../base-terrain-yield-trade/Rules/Tile/yield.js';

describe('HangingGardens', () => {
  it('should provide one additional Happiness in the city', () => {
    const rulesRegistry = new RulesRegistry(),
      wonderRegistry = new WonderRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      city = setUpCity({
        rulesRegistry,
        size: 5,
        tileImprovementRegistry,
      }),
      advanceRegistry = new AdvanceRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      playerResearch = new PlayerResearch({
        advanceRegistry,
        player: city.player(),
        rulesRegistry,
      })
    ;

    rulesRegistry.register(
      ...cityYield({
        playerResearchRegistry,
        wonderRegistry,
      })
    );
    playerResearchRegistry.register(playerResearch);

    const [happinessYield] = city.yields({
      yields: [Happiness],
    });

    assert.strictEqual(happinessYield.value(), 0);

    wonderRegistry.register(new HangingGardens({
      city,
      rulesRegistry,
    }));

    const [updatedHappinessYield] = city.yields({
      yields: [Happiness],
    });

    assert.strictEqual(updatedHappinessYield.value(), 1);
  });

  it('should not provide one additional Happiness in the city once Invention is discovered', () => {
    const rulesRegistry = new RulesRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      wonderRegistry = new WonderRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      city = setUpCity({
        rulesRegistry,
        size: 5,
        tileImprovementRegistry,
      }),
      playerResearch = new PlayerResearch({
        player: city.player(),
        rulesRegistry,
      })
    ;

    rulesRegistry.register(
      ...cityYield({
        playerResearchRegistry,
        wonderRegistry,
      }),
      ...tileYield({
        tileImprovementRegistry,
      })
    );

    playerResearchRegistry.register(playerResearch);

    wonderRegistry.register(new HangingGardens({
      city,
      rulesRegistry,
    }));

    const [happinessYield] = city.yields({
      yields: [Happiness],
    });

    assert.strictEqual(happinessYield.value(), 1);

    playerResearch.addAdvance(Invention);

    const [updatedHappinessYield] = city.yields({
      yields: [Happiness],
    });

    assert.strictEqual(updatedHappinessYield.value(), 0);
  });

  it('should provide one additional Happiness in all cities the building player owns', () => {
    const rulesRegistry = new RulesRegistry(),
      wonderRegistry = new WonderRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      city = setUpCity({
        rulesRegistry,
        size: 5,
        tileImprovementRegistry,
      }),
      advanceRegistry = new AdvanceRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      playerResearch = new PlayerResearch({
        advanceRegistry,
        player: city.player(),
        rulesRegistry,
      })
    ;

    rulesRegistry.register(
      ...cityYield({
        playerResearchRegistry,
        wonderRegistry,
      })
    );
    playerResearchRegistry.register(playerResearch);

    const [happinessYield] = city.yields({
      yields: [Happiness],
    });

    assert.strictEqual(happinessYield.value(), 0);

    wonderRegistry.register(new HangingGardens({
      city,
      rulesRegistry,
    }));

    const [updatedHappinessYield] = city.yields({
      yields: [Happiness],
    });

    assert.strictEqual(updatedHappinessYield.value(), 1);
  });
});
