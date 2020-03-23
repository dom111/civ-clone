import {Attack, Move} from '../../../base-unit/Actions.js';
import {Disembark, Embark, Unload} from '../../Actions.js';
import City from '../../../core-city/City.js';
import CityRegistry from '../../../core-city/CityRegistry.js';
import {Land} from '../../../core-terrain/Types.js';
import {Militia} from '../../../base-unit/Units.js';
import Player from '../../../core-player/Player.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import TransportRegistry from '../../TransportRegistry.js';
import {Trireme} from '../../Units.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';
import action from '../../../base-unit/Rules/Unit/action.js';
import assert from 'assert';
import created from '../../../base-unit-yields/Rules/Unit/created.js';
import moved from '../../../base-unit/Rules/Unit/moved.js';
import movementCost from '../../../base-unit/Rules/Unit/movementCost.js';
import simpleWorldLoader from '../../../base-world/tests/lib/simpleLoadWorld.js';
import transportAction from '../../Rules/Unit/action.js';
import transportMoved from '../../Rules/Unit/moved.js';
import transportMovementCost from '../../Rules/Unit/movementCost.js';
import transportYield from '../../Rules/Unit/yield.js';
import unitYield from '../../../base-unit-yields/Rules/Unit/yield.js';
import validateMove from '../../../base-unit/Rules/Unit/validateMove.js';

describe('Trireme', () => {
  const cityRegistry = new CityRegistry(),
    rulesRegistry = new RulesRegistry(),
    transportRegistry = new TransportRegistry(),
    unitRegistry = new UnitRegistry()
  ;

  rulesRegistry.register(
    ...action({
      cityRegistry,
      rulesRegistry,
      transportRegistry,
      unitRegistry,
    }),
    ...created(),
    ...moved(),
    ...movementCost(),
    ...transportAction({
      rulesRegistry,
      transportRegistry,
      unitRegistry,
    }),
    ...transportMoved(),
    ...transportMovementCost({
      transportRegistry,
    }),
    ...transportYield(),
    ...unitYield(),
    ...validateMove()
  );

  const generateIslands = () => {
    const world = simpleWorldLoader('9OG44OG9O');

    assert(world.get(1, 1).terrain instanceof Land);
    assert(world.get(6, 6).terrain instanceof Land);

    return world;
  };

  it('should be able to move across water', () => {
    const world = generateIslands(),
      tile = world.get(2, 2),
      player = new Player(),
      transport = new Trireme({
        player,
        rulesRegistry,
        tile,
      }),
      to = world.get(3, 3)
    ;

    assert.strictEqual(tile, world.get(2, 2));
    assert(transport.actions(to)
      .some((action) => action instanceof Move)
    );
  });

  it('should be possible to stow other units on it', () => {
    const world = generateIslands(),
      tile = world.get(2, 2),
      player = new Player(),
      transport = new Trireme({
        player,
        rulesRegistry,
        tile,
        transportRegistry,
      }),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: world.get(1, 1),
      })
    ;

    unitRegistry.register(transport, unit);

    const [embark] = unit.actions(tile)
      .filter((action) => action instanceof Embark)
    ;

    assert(embark instanceof Embark);

    embark.perform({
      unitRegistry,
    });

    assert(transport.hasCargo());
    assert(transport.cargo()
      .includes(unit)
    );
    assert(transportRegistry.getBy('unit', unit)
      .every((manifest) => manifest.transport() === transport)
    );

    unitRegistry.unregister(transport, unit);
  });

  it('should be possible to transport units', () => {
    const world = generateIslands(),
      tile = world.get(2, 2),
      player = new Player(),
      transport = new Trireme({
        player,
        rulesRegistry,
        tile,
        transportRegistry,
      }),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: world.get(1, 1),
      }),
      to = world.get(2, 2)
    ;

    unitRegistry.register(transport, unit);

    const [embark] = unit.actions(to)
      .filter((action) => action instanceof Embark)
    ;

    embark.perform({unitRegistry});

    assert.strictEqual(unit.tile(), transport.tile());

    const [move1] = transport.actions(world.get(3, 3))
      .filter((action) => action instanceof Move)
    ;

    assert(move1 instanceof Move);

    transport.action({
      action: move1,
    });

    assert.strictEqual(transport.tile(), world.get(3, 3));
    assert.strictEqual(unit.tile(), world.get(3, 3));

    const [move2] = transport.actions(world.get(4, 4))
      .filter((action) => action instanceof Move)
    ;

    assert(move2 instanceof Move);

    transport.action({
      action: move2,
    });

    assert.strictEqual(transport.tile(), world.get(4, 4));
    assert.strictEqual(unit.tile(), world.get(4, 4));

    const [move3] = transport.actions(world.get(5, 5))
      .filter((action) => action instanceof Move)
    ;

    assert(move3 instanceof Move);

    transport.action({
      action: move3,
    });

    assert.strictEqual(transport.tile(), world.get(5, 5));
    assert.strictEqual(unit.tile(), world.get(5, 5));
    assert.strictEqual(transport.moves().value(), 0);

    transport.moves().add(transport.movement());

    const [unload] = transport.actions()
      .filter((action) => action instanceof Unload)
    ;

    assert(unload instanceof Unload);

    transport.action({
      action: unload,
    });

    const [disembark] = unit.actions(world.get(6, 6));

    assert(disembark instanceof Disembark);

    unit.action({
      action: disembark,
    });

    assert.strictEqual(unit.tile(), world.get(6, 6));

    unitRegistry.unregister(transport, unit);
  });

  it('should be possible to Attack a defended enemy city', () => {
    const world = generateIslands(),
      tile = world.get(2, 2),
      player = new Player(),
      enemy = new Player(),
      transport = new Trireme({
        player,
        rulesRegistry,
        tile,
        transportRegistry,
      }),
      city = new City({
        player: enemy,
        tile: world.get(1, 1),
      }),
      unit = new Militia({
        player: enemy,
        rulesRegistry,
        tile: world.get(1, 1),
      })
    ;

    cityRegistry.register(city);
    unitRegistry.register(transport, unit);

    assert(transport.actions(city.tile())
      .some((action) => action instanceof Attack)
    );

    cityRegistry.unregister(city);
    unitRegistry.unregister(transport, unit);
  });

  it('should be possible to Attack an enemy unit', () => {
    const world = generateIslands(),
      tile = world.get(2, 2),
      player = new Player(),
      enemy = new Player(),
      transport = new Trireme({
        player,
        rulesRegistry,
        tile,
      }),
      unit = new Militia({
        player: enemy,
        rulesRegistry,
        tile: world.get(1, 1),
      })
    ;

    unitRegistry.register(transport, unit);

    assert(transport.actions(unit.tile())
      .some((action) => action instanceof Attack)
    );

    unitRegistry.unregister(transport, unit);
  });

  it('should not be possible to Attack an undefended enemy city', () => {
    const world = generateIslands(),
      tile = world.get(2, 2),
      player = new Player(),
      enemy = new Player(),
      transport = new Trireme({
        player,
        rulesRegistry,
        tile,
      }),
      city = new City({
        player: enemy,
        tile: world.get(1, 1),
      })
    ;

    cityRegistry.register(city);
    unitRegistry.register(transport);

    assert(! transport.actions(city.tile())
      .some((action) => action instanceof Attack)
    );

    cityRegistry.unregister(city);
    unitRegistry.unregister(transport);
  });
});
