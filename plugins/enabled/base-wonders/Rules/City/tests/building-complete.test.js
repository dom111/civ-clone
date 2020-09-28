import AvailableCityBuildItemsRegistry from '../../../../base-city/AvailableCityBuildItemsRegistry.js';
import CityBuild from '../../../../base-city/CityBuild.js';
import CityBuildRegistry from '../../../../base-city/CityBuildRegistry.js';
import Colossus from '../../../../base-wonder-colossus/Colossus.js';
import {Production} from '../../../../base-terrain-yields/Yields.js';
import RulesRegistry from '../../../../core-rules-registry/RulesRegistry.js';
import WonderRegistry from '../../../../core-wonder/WonderRegistry.js';
import assert from 'assert';
import build from '../build.js';
import buildCost from '../../../../base-wonder-colossus/Rules/City/build-cost.js';
import buildingComplete from '../building-complete.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:building-complete', () => {
  it('should clear the building progress when the wonder is completed elsewhere', () => {
    const availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
      cityBuildRegistry = new CityBuildRegistry(),
      rulesRegistry = new RulesRegistry(),
      wonderRegistry = new WonderRegistry(),
      city = setUpCity(),
      cityBuild1 = new CityBuild({
        availableCityBuildItemsRegistry,
        city,
        rulesRegistry,
      }),
      cityBuild2 = new CityBuild({
        availableCityBuildItemsRegistry,
        city,
        rulesRegistry,
      })
    ;

    cityBuildRegistry.register(
      cityBuild1,
      cityBuild2
    );
    rulesRegistry.register(
      ...build({
        wonderRegistry,
      }),
      ...buildCost(),
      ...buildingComplete({
        cityBuildRegistry,
        wonderRegistry,
      })
    );
    availableCityBuildItemsRegistry.register(Colossus);
    cityBuild1.build(Colossus);
    cityBuild2.build(Colossus);


    assert.strictEqual(cityBuild1.building(), Colossus);
    assert.strictEqual(cityBuild2.building(), Colossus);

    cityBuild1.add(new Production(200));
    cityBuild2.add(new Production(200));

    assert.strictEqual(cityBuild1.progress().value(), 200);
    assert.strictEqual(cityBuild2.progress().value(), 200);

    cityBuild1.check();

    assert.strictEqual(cityBuild1.building(), null);
    assert.strictEqual(cityBuild2.building(), null);
    assert.strictEqual(cityBuild1.progress().value(), 0);
    assert.strictEqual(cityBuild2.progress().value(), 200);
  });
});
