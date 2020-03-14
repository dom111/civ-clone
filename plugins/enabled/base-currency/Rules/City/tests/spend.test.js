import AvailableCityImprovementRegistry from '../../../../core-city-improvement/AvailableCityImprovementRegistry.js';
import AvailableUnitRegistry from '../../../../core-unit/AvailableUnitRegistry.js';
import CityBuild from '../../../../base-city/CityBuild.js';
import CityBuildRegistry from '../../../../base-city/CityBuildRegistry.js';
import {Militia} from '../../../../base-unit/Units.js';
import PlayerTreasury from '../../../PlayerTreasury.js';
import {Production} from '../../../../base-terrain-yields/Yields.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import {Temple} from '../../../../base-city-improvements/CityImprovements.js';
import assert from 'assert';
import cityImprovementBuildCost from '../../../../base-city-improvements/Rules/City/build-cost.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';
import spend from '../spend.js';
import unitBuildCost from '../../../../base-unit/Rules/City/build-cost.js';

describe('city:spend', () => {
  const rulesRegistry = new RulesRegistry(),
    availableCityImprovementRegistry = new AvailableCityImprovementRegistry(),
    availableUnitRegistry = new AvailableUnitRegistry(),
    cityBuildRegistry = new CityBuildRegistry()
  ;

  rulesRegistry.register(
    ...cityImprovementBuildCost(),
    ...spend(),
    ...unitBuildCost()
  );

  availableCityImprovementRegistry.register(Temple);
  availableUnitRegistry.register(Militia);

  [
    [Temple, 0, 160],
    [Temple, 1, 78],
    [Temple, 39, 2],
    [Militia, 0, 50],
    [Militia, 1, 22],
    [Militia, 9, 2],
  ]
    .forEach(([BuildItem, progress, expectedCost]) => {
      it(`should cost ${expectedCost} Gold to buy a ${BuildItem.name} with ${progress} progress`, () => {
        const city = setUpCity({
            rulesRegistry,
          }),
          cityBuild = new CityBuild({
            availableCityImprovementRegistry,
            availableUnitRegistry,
            city,
            rulesRegistry,
          })
        ;

        cityBuildRegistry.register(cityBuild);

        const playerTreasury = new PlayerTreasury({
          player: city.player,
          rulesRegistry,
          cityBuildRegistry,
        });

        playerTreasury.add(expectedCost);

        assert.strictEqual(playerTreasury.value(), expectedCost);

        cityBuild.build(BuildItem);

        assert.strictEqual(cityBuild.progress.value(), 0);

        cityBuild.add(new Production(progress));

        assert.strictEqual(cityBuild.progress.value(), progress);

        const goldCost = playerTreasury.cost(city);

        assert.strictEqual(goldCost.value(), expectedCost);

        playerTreasury.buy(city);

        assert.strictEqual(playerTreasury.value(), 0);
      });
    })
  ;
});
