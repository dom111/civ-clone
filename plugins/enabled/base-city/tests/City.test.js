import '../Rules/City/cost.js';
import {Food} from '../../base-terrain-yields/Yields.js';
import assert from 'assert';
import setUpCity from './lib/setUpCity.js';

describe('City', () => {
  describe('food cost', () => {
    it('should cost 2 food per population point to feed the city', () => {
      const city = setUpCity(5);

      const [food] = city.yields()
        .filter((cityYield) => cityYield instanceof Food)
      ;

      assert.strictEqual(food.value(), 2);
    });
  });
});
