import '../../../../base-currency/registerYields.js';
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
} from '../../../../base-city-improvements-civ1/CityImprovements.js';
import CityImprovementRegistry from '../../../../core-city-improvement/CityImprovementRegistry.js';
import {Gold} from '../../../../base-currency/Yields.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import aqueductCost from '../../../../base-city-improvement-aqueduct/Rules/City/cost.js';
import assert from 'assert';
import citywallsCost from '../../../../base-city-improvement-citywalls/Rules/City/cost.js';
import colosseumCost from '../../../../base-city-improvement-colosseum/Rules/City/cost.js';
import courthouseCost from '../../../../base-city-improvement-courthouse/Rules/City/cost.js';
import granaryCost from '../../../../base-city-improvement-granary/Rules/City/cost.js';
import libraryCost from '../../../../base-city-improvement-library/Rules/City/cost.js';
import marketplaceCost from '../../../../base-city-improvement-marketplace/Rules/City/cost.js';
import setUpCity from '../../../../base-city/tests/lib/setUpCity.js';
import templeCost from '../../../../base-city-improvement-temple/Rules/City/cost.js';

describe('city:cost', () => {
  const rulesRegistry = new RulesRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry()
  ;

  rulesRegistry.register(
    ...aqueductCost({
      cityImprovementRegistry,
    }),
    ...citywallsCost({
      cityImprovementRegistry,
    }),
    ...colosseumCost({
      cityImprovementRegistry,
    }),
    ...courthouseCost({
      cityImprovementRegistry,
    }),
    ...granaryCost({
      cityImprovementRegistry,
    }),
    ...libraryCost({
      cityImprovementRegistry,
    }),
    ...marketplaceCost({
      cityImprovementRegistry,
    }),
    ...templeCost({
      cityImprovementRegistry,
    })
  );

  [
    [Aqueduct, 2, Gold],
    [Barracks, 0, Gold],
    [CityWalls, 2, Gold],
    [Courthouse, 1, Gold],
    [Colosseum, 2, Gold],
    [Granary, 1, Gold],
    [Library, 1, Gold],
    [Marketplace, 1, Gold],
    [Palace, 0, Gold],
    [Temple, 1, Gold],
  ]
    .forEach(([Improvement, cost, Yield]) => {
      it(`should cost ${cost} ${Yield.name} to maintain ${Improvement.name}`, () => {
        const city = setUpCity({
          cityImprovementRegistry,
          rulesRegistry,
        });

        cityImprovementRegistry.register(new Improvement({
          city,
          rulesRegistry,
        }));

        const [cityYield] = city.yields({
          yields: [Gold],
        });

        assert.strictEqual(cityYield.value(), 0 - cost, `${Improvement.name} should cost ${cost} ${Yield.name} (${-cityYield.value()})`);
      });
    })
  ;
});
