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
import improvementCreated from '../improvement-created.js';
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
    ...improvementCreated({
      cityImprovementRegistry,
    })
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
  ]
    .forEach((Improvement) => {
      it(`should be possible to build ${Improvement.name} in a city`, () => {
        const city = setUpCity({
            rulesRegistry,
          }),
          cityBuild = new CityBuild({
            availableCityImprovementRegistry,
            city,
            rulesRegistry,
          })
        ;

        assert(cityBuild.available()
          .includes(Improvement)
        );
      });

      it(`should not be possible to build ${Improvement.name} in a city that already contains one`, () => {
        const city = setUpCity({
            rulesRegistry,
          }),
          cityBuild = new CityBuild({
            availableCityImprovementRegistry,
            city,
            rulesRegistry,
          })
        ;

        cityImprovementRegistry.register(new Improvement({
          city,
          rulesRegistry,
        }));

        assert(! cityBuild.available()
          .includes(Improvement)
        );
      });
    })
  ;
});
