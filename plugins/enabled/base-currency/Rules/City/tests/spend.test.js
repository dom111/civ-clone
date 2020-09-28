import AvailableCityBuildItemsRegistry from '../../../../base-city/AvailableCityBuildItemsRegistry.js';
import CityBuild from '../../../../base-city/CityBuild.js';
import CityBuildRegistry from '../../../../base-city/CityBuildRegistry.js';
import PlayerTreasury from '../../../PlayerTreasury.js';
import {Production} from '../../../../base-terrain-yields/Yields.js';
import RulesRegistry from '../../../../core-rules-registry/RulesRegistry.js';
import {Temple} from '../../../../base-city-improvements-civ1/CityImprovements.js';
import {Warrior} from '../../../../base-units-civ1/Units.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';
import spend from '../spend.js';
import templeBuildCost from '../../../../base-city-improvement-temple/Rules/City/build-cost.js';
import warriorCityBuildCost from '../../../../base-unit-warrior/Rules/City/build-cost.js';

describe('city:spend', () => {
  const rulesRegistry = new RulesRegistry(),
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    cityBuildRegistry = new CityBuildRegistry()
  ;

  rulesRegistry.register(
    ...spend(),
    ...templeBuildCost(),
    ...warriorCityBuildCost()
  );

  availableCityBuildItemsRegistry.register(Warrior, Temple);

  [
    [Temple, 0, 160],
    [Temple, 1, 78],
    [Temple, 39, 2],
    [Warrior, 0, 50],
    [Warrior, 1, 22],
    [Warrior, 9, 2],
  ]
    .forEach(([BuildItem, progress, expectedCost]) => {
      it(`should cost ${expectedCost} Gold to buy a ${BuildItem.name} with ${progress} progress`, () => {
        const city = setUpCity({
            rulesRegistry,
          }),
          cityBuild = new CityBuild({
            availableCityBuildItemsRegistry,
            city,
            rulesRegistry,
          })
        ;

        cityBuildRegistry.register(cityBuild);

        const playerTreasury = new PlayerTreasury({
          player: city.player(),
          rulesRegistry,
          cityBuildRegistry,
        });

        playerTreasury.add(expectedCost);

        assert.strictEqual(playerTreasury.value(), expectedCost);

        cityBuild.build(BuildItem);

        assert.strictEqual(cityBuild.progress().value(), 0);

        cityBuild.add(new Production(progress));

        assert.strictEqual(cityBuild.progress().value(), progress);

        const goldCost = playerTreasury.cost(city);

        assert.strictEqual(goldCost.value(), expectedCost);

        playerTreasury.buy(city);

        assert.strictEqual(playerTreasury.value(), 0);
      });
    })
  ;
});
