import * as CityImprovements from '../../../CityImprovements.js';
import AvailableCityBuildItemsRegistry from '../../../../base-city/AvailableCityBuildItemsRegistry.js';
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
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry()
  ;

  rulesRegistry.register(
    ...build({
      cityImprovementRegistry,
    }),
    ...buildCost()
  );

  availableCityBuildItemsRegistry.register(...Object.values(CityImprovements));

  [
    [CityImprovements.Aqueduct, 120],
    [CityImprovements.Barracks, 40],
    [CityImprovements.CityWalls, 120],
    [CityImprovements.Colosseum, 100],
    [CityImprovements.Courthouse, 80],
    [CityImprovements.Granary, 60],
    [CityImprovements.Library, 80],
    [CityImprovements.Marketplace, 80],
    [CityImprovements.Palace, 200],
    [CityImprovements.Temple, 40],
  ]
    .forEach(([Improvement, cost]) => {
      it(`should cost ${cost} to build ${Improvement.name}`, () => {
        const city = setUpCity({
            rulesRegistry,
          }),
          cityBuild = new CityBuild({
            availableCityBuildItemsRegistry,
            city,
            rulesRegistry,
          })
        ;

        cityBuild.build(Improvement);

        assert.strictEqual(cityBuild.building(), Improvement);
        assert.strictEqual(cityBuild.cost().value(), cost);
      });
    })
  ;
});
