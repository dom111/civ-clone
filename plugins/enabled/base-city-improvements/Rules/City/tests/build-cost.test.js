import '../../../register.js';
import '../build-cost.js';
import {Aqueduct, Barracks, CityWalls, Courthouse, Granary, Library, Palace, Temple} from '../../../CityImprovements.js';
import CityBuild from '../../../../base-city/CityBuild.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:build-cost', () => {
  [
    [Aqueduct, 120],
    [Barracks, 40],
    [CityWalls, 120],
    [Courthouse, 80],
    [Granary, 60],
    [Library, 80],
    [Palace, 200],
    [Temple, 40],
  ]
    .forEach(([Improvement, cost]) => {
      it(`should cost ${cost} to build ${Improvement.name}`, () => {
        const city = setUpCity(),
          cityBuild = new CityBuild(city)
        ;

        cityBuild.build(Improvement);

        assert.strictEqual(cityBuild.building(), Improvement);
        assert.strictEqual(cityBuild.cost, cost);
      });
    })
  ;
});
