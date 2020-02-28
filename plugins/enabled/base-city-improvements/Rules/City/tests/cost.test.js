import '../cost.js';
import '../../../../base-currency/register.js';
import {
  Aqueduct,
  Barracks,
  CityWalls,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Palace,
  Temple,
} from '../../../../base-city-improvements/CityImprovements.js';
import CityImprovementRegistry from '../../../../core-city-improvement/CityImprovementRegistry.js';
import {Gold} from '../../../../base-currency/Yields.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:cost', () => {
  [
    [Barracks, Gold],
    [Palace, Gold],
  ]
    .forEach(([Improvement, Yield]) => {
      it(`should not cost ${Yield.name} to maintain ${Improvement.name}`, () => {
        const city = setUpCity();

        CityImprovementRegistry.register(new Improvement({
          city,
        }));

        const [cityYield] = city.yields()
          .filter((cityYield) => cityYield instanceof Yield)
        ;

        assert.strictEqual(cityYield.value(), 0);
      });
    })
  ;

  [
    [Aqueduct, 2, Gold],
    [CityWalls, 2, Gold],
    [Courthouse, 1, Gold],
    [Granary, 1, Gold],
    [Library, 1, Gold],
    [Marketplace, 1, Gold],
    [Temple, 1, Gold],
  ]
    .forEach(([Improvement, cost, Yield]) => {
      it(`should cost ${cost} ${Yield.name} to maintain ${Improvement.name}`, () => {
        const city = setUpCity();

        CityImprovementRegistry.register(new Improvement({
          city,
        }));

        const [cityYield] = city.yields()
          .filter((cityYield) => cityYield instanceof Yield)
        ;

        assert.strictEqual(cityYield.value(), -cost);
      });
    })
  ;
});
