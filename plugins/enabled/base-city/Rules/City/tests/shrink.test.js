import CityGrowthRegistry from '../../../CityGrowthRegistry.js';
import {Food} from '../../../../base-terrain-yields/Yields.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import created from '../created.js';
import setUpCity from '../../../tests/lib/setUpCity.js';
import shrink from '../shrink.js';

describe('city:shrink', () => {
  const rulesRegistry = new RulesRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry()
  ;

  rulesRegistry.register(
    ...created({
      cityGrowthRegistry,
    }),
    ...shrink({
      cityGrowthRegistry,
    })
  );

  it('should empty the food storage', () => {
    const city = setUpCity({
        size: 10,
        rulesRegistry,
      }),
      [cityGrowth] = cityGrowthRegistry.getBy('city', city)
    ;

    [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]
      .forEach((value) => {
        cityGrowth.add(new Food(cityGrowth.cost));

        city.shrink();

        assert.strictEqual(cityGrowth.progress.value(), value);
      })
    ;

    assert.strictEqual(city.size, 1);
  });
});
