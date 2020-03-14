import {Militia} from '../../../../base-unit/Units.js';
import Player from '../../../../core-player/Player.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../../../core-unit/UnitRegistry.js';
import assert from 'assert';
import captured from '../captured.js';
import created from '../created.js';
import setUpCity from '../../../tests/lib/setUpCity.js';
import shrink from '../shrink.js';
import unitCreated from '../../../../base-unit/Rules/Unit/created.js';
import unitDestroyed from '../../../../base-unit/Rules/Unit/destroyed.js';

describe('city:captured', () => {
  const rulesRegistry = new RulesRegistry(),
    unitRegistry = new UnitRegistry()
  ;

  rulesRegistry.register(
    ...captured({
      unitRegistry,
    }),
    ...created(),
    ...shrink(),
    ...unitCreated({
      unitRegistry,
    }),
    ...unitDestroyed({
      unitRegistry,
    })
  );

  it('should cause a city to lose a population point when captured', () => {
    const city = setUpCity({
        size: 2,
        rulesRegistry,
      }),
      enemy = new Player()
    ;

    assert.strictEqual(city.size, 2);

    city.capture(enemy);

    assert.strictEqual(city.size, 1);
    assert.strictEqual(city.player, enemy);
  });

  it('should destroy all of the cities units when captured', () => {
    const city = setUpCity({
        rulesRegistry,
      }),
      enemy = new Player(),
      unit = new Militia({
        city,
        ...city,
        rulesRegistry,
      })
    ;

    unitRegistry.register(unit);

    city.capture(enemy);

    assert(unit.destroyed);
    assert(! unitRegistry.entries()
      .includes(unit)
    );

    unitRegistry.unregister(unit);
  });
});
