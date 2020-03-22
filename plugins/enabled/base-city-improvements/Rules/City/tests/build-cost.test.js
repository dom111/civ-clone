import {
  Aqueduct,
  Barracks,
  CityWalls,
  Colosseum,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Palace,
  Temple,
} from '../../../CityImprovements.js';
import AvailableCityImprovementRegistry from '../../../../core-city-improvement/AvailableCityImprovementRegistry.js';
import CityBuild from '../../../../base-city/CityBuild.js';
import CityImprovementRegistry from '../../../../core-city-improvement/CityImprovementRegistry.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import assert from 'assert';
import build from '../build.js';
import buildCost from '../build-cost.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:build', () => {
  const rulesRegistry = new RulesRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    availableCityImprovementRegistry = new AvailableCityImprovementRegistry()
  ;

  rulesRegistry.register(
    ...build({
      cityImprovementRegistry,
    }),
    ...buildCost()
  );

  availableCityImprovementRegistry.register(...[
    Aqueduct,
    Barracks,
    CityWalls,
    Colosseum,
    Courthouse,
    Granary,
    Library,
    Marketplace,
    Palace,
    Temple,
  ]);

  [
    [Aqueduct, 120],
    [Barracks, 40],
    [CityWalls, 120],
    [Colosseum, 200],
    [Courthouse, 80],
    [Granary, 60],
    [Library, 80],
    [Marketplace, 80],
    [Palace, 200],
    [Temple, 40],
  ]
    .forEach(([Improvement, cost]) => {
      it(`should cost ${cost} to build ${Improvement.name}`, () => {
        const city = setUpCity({
            rulesRegistry,
          }),
          cityBuild = new CityBuild({
            availableCityImprovementRegistry,
            city,
            rulesRegistry,
          })
        ;

        cityBuild.build(Improvement);

        assert.strictEqual(cityBuild.building(), Improvement);
        assert.strictEqual(cityBuild.cost(), cost);
      });
    })
  ;
});
