import '../build.js';
import '../../../register.js';
import {Aqueduct, Barracks, CityWalls, Courthouse, Granary, Library, Palace, Temple} from '../../../CityImprovements.js';
import CityBuildRegistry from '../../../../base-city/CityBuildRegistry.js';
import CityImprovementRegistry from '../../../../core-city-improvement/CityImprovementRegistry.js';
import assert from 'assert';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';

describe('city:build', () => {
  [Aqueduct, Barracks, CityWalls, Courthouse, Granary, Library, Palace, Temple]
    .forEach((Improvement) => {
      it(`should be possible to build ${Improvement.name} in a city`, () => {
        const city = setUpCity(),
          [cityBuild] = CityBuildRegistry.getBy('city', city)
        ;

        assert(cityBuild.available()
          .includes(Improvement)
        );
      });

      it(`should not be possible to build ${Improvement.name} in a city that already contains one`, () => {
        const city = setUpCity(),
          [cityBuild] = CityBuildRegistry.getBy('city', city)
        ;

        CityImprovementRegistry.register(new Improvement({
          city,
        }));

        assert(! cityBuild.available()
          .includes(Improvement)
        );
      });
    })
  ;
});
