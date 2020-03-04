import '../grow.js';
import '../process-yield.js';
import '../shrink.js';
import {Food} from '../../../../base-terrain-yields/Yields/Food.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import setUpCity from '../../../tests/lib/setUpCity.js';

describe('city:process-yield', () => {
  it('should cause a city to grow when the food cost is met', () => {
    const city = setUpCity(),
      cityYield = new Food(20)
    ;

    assert.strictEqual(city.size, 1);

    RulesRegistry.get('city:process-yield')
      .filter((rule) => rule.validate(cityYield, city))
      .forEach((rule) => rule.process(cityYield, city))
    ;

    assert.strictEqual(city.size, 2);
  });

  it('should cause a city to shrink when the food store is depleted', () => {
    const city = setUpCity(2),
      cityYield = new Food(-1)
    ;

    assert.strictEqual(city.size, 2);

    RulesRegistry.get('city:process-yield')
      .filter((rule) => rule.validate(cityYield, city))
      .forEach((rule) => rule.process(cityYield, city))
    ;

    assert.strictEqual(city.size, 1);
  });
});
