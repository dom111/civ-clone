import {Food} from '../../../../base-terrain-yields/Yields.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import cost from '../cost.js';
import setUpCity from '../../../tests/lib/setUpCity.js';

describe('city:cost', () => {
  const rulesRegistry = new RulesRegistry();

  rulesRegistry.register(
    ...cost()
  );

  it('should cost 2 food to feed each population point', () => {
    const city = setUpCity({
        rulesRegistry,
      }),
      cityYields = city.yields({
        yields: [
          Food,
        ],
      }),
      [cityFood] = cityYields.filter((cityYield) => cityYield instanceof Food)
    ;

    assert.strictEqual(cityFood.value(), -2);

    [
      -4,
      -6,
      -8,
      -10,
      -12,
      -14,
      -16,
      -18,
      -20,
    ]
      .forEach((value) => {
        city.grow();

        const updatedCityYields = city.yields({
            yields: [
              Food,
            ],
          }),
          [updatedCityFood] = updatedCityYields.filter((cityYield) => cityYield instanceof Food)
        ;

        assert.strictEqual(updatedCityFood.value(), value);
      })
    ;
  });
});
