import {Food} from '../../../../base-terrain-yields/Yields/Food.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import created from '../created.js';
import grow from '../grow.js';
import processYield from '../process-yield.js';
import setUpCity from '../../../tests/lib/setUpCity.js';
import shrink from '../shrink.js';

describe('city:process-yield', () => {
  const rulesRegistry = new RulesRegistry();

  rulesRegistry.register(
    ...created(),
    ...grow(),
    ...processYield(),
    ...shrink()
  );

  it('should cause a city to grow when the food cost is met', () => {
    const city = setUpCity({
        rulesRegistry,
      }),
      cityYield = new Food(20)
    ;

    assert.strictEqual(city.size(), 1);

    rulesRegistry.process('city:process-yield', cityYield, city);

    assert.strictEqual(city.size(), 2);
  });

  it('should cause a city to shrink when the food store is depleted', () => {
    const city = setUpCity({
        size: 2,
        rulesRegistry,
      }),
      cityYield = new Food(-1)
    ;

    assert.strictEqual(city.size(), 2);

    rulesRegistry.process('city:process-yield', cityYield, city);

    assert.strictEqual(city.size(), 1);
  });
});
