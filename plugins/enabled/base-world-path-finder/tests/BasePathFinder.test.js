import '../../base-terrain/registerTerrains.js';
import '../../base-terrain-features/registerAvailableTerrainFeatures.js';
import {simpleRLEDecoder, simpleWorldLoader} from '../../base-world/tests/lib/simpleLoadWorld.js';
import BasePathFinder from '../BasePathFinder.js';
import City from '../../core-city/City.js';
import CityRegistry from '../../core-city/CityRegistry.js';
import {Militia} from '../../base-unit/Units.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';
import action from '../../base-unit/Rules/Unit/action.js';
import assert from 'assert';
import created from '../../base-unit-yields/Rules/Unit/created.js';
import getPlayers from '../../base-player/tests/lib/getPlayers.js';
import moved from '../../base-unit/Rules/Unit/moved.js';
import movementCost from '../../base-unit/Rules/Unit/movementCost.js';
import unitYield from '../../base-unit-yields/Rules/Unit/yield.js';
import validateMove from '../../base-unit/Rules/Unit/validateMove.js';

describe('BasePathFinder', () => {
  const rulesRegistry = new RulesRegistry(),
    cityRegistry = new CityRegistry(),
    unitRegistry = new UnitRegistry()
  ;

  rulesRegistry.register(
    ...movementCost(),
    ...action({
      cityRegistry,
      rulesRegistry,
      unitRegistry,
    }),
    ...moved(),
    ...validateMove(),
    ...created(),
    ...unitYield()
  );

  it('should return the shortest path length for neighbouring tiles', () => {
    const world = simpleWorldLoader('100Gd'),
      player = getPlayers({
        rulesRegistry,
      }),
      startTile = world.get(3, 3),
      targetTile = world.get(4, 4),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: startTile,
      })
    ;

    const pathFinder = new BasePathFinder(unit, startTile, targetTile),
      path = pathFinder.generate()
    ;

    assert.strictEqual(path.length, 2);
  });

  it('should find a valid path avoiding water', () => {
    const world = simpleWorldLoader({
        height: 11,
        width: 10,
        map: simpleRLEDecoder('11O8G10OG2O5G2OGOG5OGOGOG2OG2OGOGOGOGOGOGOGOGOG3OGOGOG2O3G2OGOG7OG2O7GO'),
      }),
      player = getPlayers({
        rulesRegistry,
      }),
      startTile = world.get(1, 1),
      targetTile = world.get(5, 6),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: startTile,
      })
    ;

    const pathFinder = new BasePathFinder(unit, startTile, targetTile),
      path = pathFinder.generate()
    ;

    assert.strictEqual(path.length, 45);
  });

  it('should correctly avoid enemy tiles and respect adjacency rules', () => {
    const world = simpleWorldLoader('7O5GO5GO5GO5GO5G'),
      [player, enemy] = getPlayers({
        n: 2,
        rulesRegistry,
      }),
      startTile = world.get(1, 1),
      targetTile = world.get(4, 4),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: startTile,
      }),
      enemyUnit = new Militia({
        player: enemy,
        rulesRegistry,
        tile: world.get(3, 3),
      }),
      city = new City({
        player: enemy,
        rulesRegistry,
        tile: world.get(3, 3),
      })
    ;

    unitRegistry.register(unit, enemyUnit);
    cityRegistry.register(city);

    const pathFinder = new BasePathFinder(unit, startTile, targetTile),
      path = pathFinder.generate()
    ;

    assert.strictEqual(path.length, 6);

    unitRegistry.unregister(unit, enemyUnit);
    cityRegistry.unregister(city);
  });

  it('should correctly yield no path when applicable', () => {
    const world = simpleWorldLoader('5OG9OG'),
      player = getPlayers({
        rulesRegistry,
      }),
      startTile = world.get(1, 1),
      targetTile = world.get(3, 3),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: startTile,
      })
    ;

    const pathFinder = new BasePathFinder(unit, startTile, targetTile),
      path = pathFinder.generate()
    ;

    assert.strictEqual(path, undefined);
  });

  it('should prefer routes with a lower movement cost', () => {
    const world = simpleWorldLoader('9O6G2OM5OGOM5OGOM5OGOM5OGOM5OG2OM4GO'),
      player = getPlayers({
        rulesRegistry,
      }),
      startTile = world.get(1, 1),
      targetTile = world.get(2, 7),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: startTile,
      })
    ;

    const pathFinder = new BasePathFinder(unit, startTile, targetTile),
      path = pathFinder.generate()
    ;

    assert.deepStrictEqual(
      [
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
        [6, 1],
        [7, 2],
        [7, 3],
        [7, 4],
        [7, 5],
        [7, 6],
        [6, 7],
        [5, 7],
        [4, 7],
        [3, 7],
        [2, 7],
      ],
      path.map((tile) => [tile.x, tile.y])
    );
  });
});
