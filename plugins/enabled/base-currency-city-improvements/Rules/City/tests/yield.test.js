import CityImprovementRegistry from '../../../../core-city-improvement/CityImprovementRegistry.js';
import {Gold} from '../../../../base-currency/Yields.js';
import {Marketplace} from '../../../../base-city-improvements-civ1/CityImprovements.js';
import RulesRegistry from '../../../../core-rules-registry/RulesRegistry.js';
import assert from 'assert';
import cityYield from '../yield.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:yield', () => {
  const rulesRegistry = new RulesRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry()
  ;

  rulesRegistry.register(
    ...cityYield({
      cityImprovementRegistry,
    })
  );

  it('should provide 50% additional Gold in a city with a Marketplace', () => {
    const city = setUpCity({
      rulesRegistry,
    });

    cityImprovementRegistry.register(new Marketplace({city}));

    city.tile().yields = () => [new Gold(4)];

    const [gold] = city.yields()
      .filter((cityYield) => cityYield instanceof Gold)
    ;

    assert.strictEqual(gold.value(), 6);
  });
});
