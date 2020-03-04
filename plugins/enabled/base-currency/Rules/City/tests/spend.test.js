import '../../../../base-city-improvements/Rules/City/build-cost.js';
import '../../../../base-city-improvements/register.js';
import '../../../../base-unit/Rules/City/build-cost.js';
import '../../../../base-unit/register.js';
import '../spend.js';
import CityBuildRegistry from '../../../../base-city/CityBuildRegistry.js';
import {Militia} from '../../../../base-unit/Units.js';
import PlayerTreasury from '../../../PlayerTreasury.js';
import {Production} from '../../../../base-terrain-yields/Yields.js';
import {Temple} from '../../../../base-city-improvements/CityImprovements.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:spend', () => {
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
        const city = setUpCity(),
          playerTreasury = new PlayerTreasury(city.player),
          [cityBuild] = CityBuildRegistry.getBy('city', city)
        ;

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
