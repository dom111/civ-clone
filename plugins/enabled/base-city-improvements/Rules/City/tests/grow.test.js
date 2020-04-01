import CityGrowthRegistry from '../../../../base-city/CityGrowthRegistry.js';
import {Granary} from '../../../../base-city-improvements-civ1/CityImprovements.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import cityGrow from '../../../../base-city/Rules/City/grow.js';
import created from '../../../../base-city/Rules/City/created.js';
import grow from '../../../../base-city-improvement-granary/Rules/City/grow.js';
import improvementCreated from  '../improvement-created.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:grow', () => {
  const rulesRegistry = new RulesRegistry();

  rulesRegistry.register(
    ...created(),
    ...cityGrow(),
    ...grow(),
    ...improvementCreated()
  );

  it('should have 50% full food storage with a granary', () => {
    const city = setUpCity({
        rulesRegistry,
      }),
      [cityGrowth] = CityGrowthRegistry.getInstance()
        .getBy('city', city)
    ;

    new Granary({city, rulesRegistry});

    [
      15,
      20,
      25,
      30,
      35,
      40,
      45,
      50,
    ]
      .forEach((value) => {
        city.grow();

        assert.strictEqual(cityGrowth.progress().value(), value);
      })
    ;
  });
});
