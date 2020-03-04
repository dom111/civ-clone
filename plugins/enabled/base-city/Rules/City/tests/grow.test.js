import '../grow.js';
import '../process-yield.js';
import '../shrink.js';
import CityGrowthRegistry from '../../../CityGrowthRegistry.js';
import {Food} from '../../../../base-terrain-yields/Yields.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import setUpCity from '../../../tests/lib/setUpCity.js';

describe('city:grow', () => {
  it('should cause a city to grow when the food cost is met', () => {
    const city = setUpCity(),
      [cityGrowth] = CityGrowthRegistry.getBy('city', city)
    ;

    assert.strictEqual(cityGrowth.progress.value(), 0);
    assert.strictEqual(cityGrowth.cost.value(), 20);

    [
      [2, 2, 20],
      [2, 4, 20],
      [12, 16, 20],
      [2, 18, 20],
      [2, 0, 30],
      [2, 2, 30],
      [26, 28, 30],
      [2, 0, 40],
    ]
      .forEach(([yieldValue, expectedProgress, expectedCost]) => {
        const cityYield = new Food(yieldValue);

        RulesRegistry.get('city:process-yield')
          .filter((rule) => rule.validate(cityYield, city))
          .forEach((rule) => rule.process(cityYield, city))
        ;

        assert.strictEqual(cityGrowth.progress.value(), expectedProgress);
        assert.strictEqual(cityGrowth.cost.value(), expectedCost);
        assert.strictEqual(city.tilesWorked.length, city.size + 1);
      })
    ;
  });
});
