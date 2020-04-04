import * as CityImprovements from '../../../../base-city-improvements-civ1/CityImprovements.js';
import AvailableCityBuildItemsRegistry from '../../../../base-city/AvailableCityBuildItemsRegistry.js';
import CityBuild from '../../../../base-city/CityBuild.js';
import CityImprovementRegistry from '../../../../core-city-improvement/CityImprovementRegistry.js';
import RulesRegistry from '../../../../core-rules-registry/RulesRegistry.js';
import aqueductBuildCost from '../../../../base-city-improvement-aqueduct/Rules/City/build-cost.js';
import assert from 'assert';
import barracksBuildCost from '../../../../base-city-improvement-barracks/Rules/City/build-cost.js';
import build from '../build.js';
import citywallsBuildCost from '../../../../base-city-improvement-citywalls/Rules/City/build-cost.js';
import colosseumBuildCost from '../../../../base-city-improvement-colosseum/Rules/City/build-cost.js';
import courthouseBuildCost from '../../../../base-city-improvement-courthouse/Rules/City/build-cost.js';
import granaryBuildCost from '../../../../base-city-improvement-granary/Rules/City/build-cost.js';
import libraryBuildCost from '../../../../base-city-improvement-library/Rules/City/build-cost.js';
import marketplaceBuildCost from '../../../../base-city-improvement-marketplace/Rules/City/build-cost.js';
import palaceBuildCost from '../../../../base-city-improvement-palace/Rules/City/build-cost.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';
import templeBuildCost from '../../../../base-city-improvement-temple/Rules/City/build-cost.js';

describe('city:build', () => {
  const rulesRegistry = new RulesRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry()
  ;

  rulesRegistry.register(
    ...aqueductBuildCost(),
    ...barracksBuildCost(),
    ...build({
      cityImprovementRegistry,
    }),
    ...citywallsBuildCost(),
    ...colosseumBuildCost(),
    ...courthouseBuildCost(),
    ...granaryBuildCost(),
    ...libraryBuildCost(),
    ...marketplaceBuildCost(),
    ...palaceBuildCost(),
    ...templeBuildCost()
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
        assert.strictEqual(cityBuild.cost().value(), cost, `${Improvement.name} should cost ${cost} (${cityBuild.cost().value()})`);
      });
    })
  ;
});
