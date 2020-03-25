import AdvanceRegistry from '../../../core-science/AdvanceRegistry.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import {Mysticism} from '../../../base-science/Advances/Mysticism.js';
import {Oracle} from '../../Wonders.js';
import PlayerResearch from '../../../base-science/PlayerResearch.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Temple} from '../../../base-city-improvements/CityImprovements.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';
import {Unhappiness} from '../../../base-city-happiness/Yields.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';
import assert from 'assert';
import cityHappinessYield from '../../../base-city-happiness/Rules/City/yield.js';
import cityYield from '../../Rules/City/yield.js';
import cost from '../../../base-city-improvements/Rules/City/cost.js';
import setUpCity from '../../../base-city/tests/lib/setUpCity.js';

describe('Oracle', () => {
  it('should reduce Unhappiness by two in a city with a temple', () => {
    const rulesRegistry = new RulesRegistry(),
      wonderRegistry = new WonderRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      cityImprovementRegistry = new CityImprovementRegistry(),
      city = setUpCity({
        cityImprovementRegistry,
        rulesRegistry,
        size: 9,
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
        cityImprovementRegistry,
        playerResearchRegistry,
        wonderRegistry,
      }),
      ...cityHappinessYield({
        rulesRegistry,
      }),
      ...cost({
        cityImprovementRegistry,
        playerResearchRegistry,
      })
    );
    playerResearchRegistry.register(playerResearch);

    [
      [() => {}, 4],
      [() => {
        cityImprovementRegistry.register(new Temple({
          city,
          rulesRegistry,
        }));
      }, 3],
      [() => {
        wonderRegistry.register(new Oracle({
          city,
          rulesRegistry,
        }));
      }, 2],
      [() => {
        playerResearch.addAdvance(Mysticism);
      }, 0],
    ]
      .forEach(([action, value]) => {
        action();

        const [unhappinessYield] = city.yields({
          yields: [Unhappiness],
        });

        assert.strictEqual(unhappinessYield.value(), value);
      })
    ;
  });
});
