import * as CityImprovements from '../../../CityImprovements.js';
import AvailableCityBuildItemsRegistry from '../../../../base-city/AvailableCityBuildItemsRegistry.js';
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
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry()
  ;

  rulesRegistry.register(
    ...build({
      cityImprovementRegistry,
    }),
    ...improvementCreated({
      cityImprovementRegistry,
    })
  );

  availableCityBuildItemsRegistry.register(...Object.values(CityImprovements));

  Object.values(CityImprovements)
    .forEach((Improvement) => {
      it(`should be possible to build ${Improvement.name} in a city`, () => {
        const city = setUpCity({
            rulesRegistry,
          }),
          cityBuild = new CityBuild({
            availableCityBuildItemsRegistry,
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
            availableCityBuildItemsRegistry,
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
