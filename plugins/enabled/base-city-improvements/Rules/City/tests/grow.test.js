import '../../../../base-city/Rules/City/grow.js';
import '../../../../base-city/Rules/City/process-yield.js';
import '../grow.js';
import '../improvement-created.js';
import CityGrowthRegistry from '../../../../base-city/CityGrowthRegistry.js';
import {Granary} from '../../../CityImprovements.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:grow', () => {
  it('should have 50% full food storage with a granary', () => {
    const city = setUpCity(),
      [cityGrowth] = CityGrowthRegistry.getBy('city', city)
    ;

    new Granary({city});

    city.grow();

    assert.strictEqual(cityGrowth.progress.value(), 15);
  });
});
