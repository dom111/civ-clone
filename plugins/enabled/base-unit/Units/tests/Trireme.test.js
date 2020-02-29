import '../../../base-unit/Rules/Unit/movementCost.js';
import '../../../base-unit-actions/Rules/Unit/action.js';
import '../../../base-unit-actions/Rules/Unit/moved.js';
import '../../../base-unit-yields/Rules/Unit/created.js';
import '../../../base-unit-yields/Rules/Unit/yield.js';
import {Disembark, Embark, Move, Unload} from '../../../base-unit-actions/Actions.js';
import {Grassland, Ocean} from '../../../base-terrain/Terrains.js';
import {Militia, Trireme} from '../../Units.js';
import Generator from '../../../core-world-generator/Generator.js';
import {Land} from '../../../core-terrain/Types.js';
import Player from '../../../core-player/Player.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';
import World from '../../../core-world/World.js';
import assert from 'assert';

describe('Trireme', () => {
  const generateIslands = () => {
    const world = new World(new (class extends Generator {
      generate() {
        const map = [];

        for (let i = 0; i < (this.width * this.height); i++) {
          map.push([9, 54].includes(i) ?
            new Grassland() :
            new Ocean()
          );
        }

        return map;
      }
    })({
      height: 8,
      width: 8,
    }));

    world.build();

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
        tile,
      }),
      to = world.get(3, 3)
    ;

    assert.strictEqual(tile, world.get(2, 2));

    assert(
      transport.actions(to)
        .some((action) => action instanceof Move)
    );

    // clean up
    UnitRegistry.entries()
      .forEach((unit) => UnitRegistry.unregister(unit))
    ;
  });

  it('should be possible to stow other units on it', () => {
    const world = generateIslands(),
      tile = world.get(2, 2),
      player = new Player(),
      transport = new Trireme({
        player,
        tile,
      }),
      unit = new Militia({
        player,
        tile: world.get(1, 1),
      }),
      to = world.get(2, 2),
      [boardTransport] = unit.actions(to)
        .filter((action) => action instanceof Embark)
    ;

    assert(boardTransport instanceof Embark);

    unit.action(boardTransport);

    assert(transport.hasCargo());
    assert(transport.cargo.includes(unit));
    assert(unit.transport === transport);
  });

  it('should be possible to transport units', () => {
    const world = generateIslands(),
      tile = world.get(2, 2),
      player = new Player(),
      transport = new Trireme({
        player,
        tile,
      }),
      unit = new Militia({
        player,
        tile: world.get(1, 1),
      }),
      to = world.get(2, 2),
      [boardTransport] = unit.actions(to)
        .filter((action) => action instanceof Embark)
    ;

    unit.action(boardTransport);

    const [move1] = transport.actions(world.get(3, 3))
      .filter((action) => action instanceof Move)
    ;

    assert(move1 instanceof Move);

    transport.action(move1);

    const [move2] = transport.actions(world.get(4, 4))
      .filter((action) => action instanceof Move)
    ;

    assert(move2 instanceof Move);

    transport.action(move2);

    const [move3] = transport.actions(world.get(5, 5))
      .filter((action) => action instanceof Move)
    ;

    assert(move3 instanceof Move);

    transport.action(move3);

    assert.strictEqual(transport.moves.value(), 0);

    transport.moves.add(transport.movement);

    const [unload] = transport.actions()
      .filter((action) => action instanceof Unload)
    ;

    assert(unload instanceof Unload);

    transport.action(unload);

    const [disembark] = unit.actions(world.get(6, 6));

    assert(disembark instanceof Disembark);

    unit.action(disembark);

    assert(unit.tile === world.get(6, 6));
  });
});
