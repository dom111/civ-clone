import {Irrigation, Road} from '../../../../base-tile-improvements/TileImprovements.js';
import CityRegistry from '../../../../core-city/CityRegistry.js';
import RulesRegistry from '../../../../core-rules-registry/RulesRegistry.js';
import TileImprovementRegistry from '../../../../core-tile-improvements/TileImprovementRegistry.js';
import assert from 'assert';
import created from '../created.js';
import destroyed from '../destroyed.js';
import setUpCity from '../../../tests/lib/setUpCity.js';

describe('city:destroyed', () => {
  const rulesRegistry = new RulesRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    cityRegistry = new CityRegistry()
  ;

  rulesRegistry.register(
    ...created({
      tileImprovementRegistry,
      cityRegistry,
    }),
    ...destroyed({
      tileImprovementRegistry,
      cityRegistry,
    })
  );

  it('should remove irrigation from the city tile', () => {
    const city = setUpCity({
      rulesRegistry,
      tileImprovementRegistry,
    });

    assert(tileImprovementRegistry.getBy('tile', city.tile())
      .some((improvement) => improvement instanceof Irrigation)
    );
    assert(tileImprovementRegistry.getBy('tile', city.tile())
      .some((improvement) => improvement instanceof Road)
    );

    city.destroy();

    assert((! tileImprovementRegistry.getBy('tile', city.tile())
      .some((improvement) => improvement instanceof Irrigation)) &&
      tileImprovementRegistry.getBy('tile', city.tile())
        .some((improvement) => improvement instanceof Road)
    );
  });

  it('should be removed from the CityRegistry', () => {
    const city = setUpCity({
      rulesRegistry,
    });

    assert(cityRegistry.entries()
      .includes(city)
    );

    city.destroy();

    assert(! cityRegistry.entries()
      .includes(city)
    );
  });
});
