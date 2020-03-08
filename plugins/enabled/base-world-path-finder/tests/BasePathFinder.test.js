import '../../base-unit/Rules/Unit/movementCost.js';
import '../../base-unit-actions/Rules/Unit/action.js';
import '../../base-unit-actions/Rules/Unit/moved.js';
import '../../base-unit-actions/Rules/Unit/validateMove.js';
import '../../base-unit-yields/Rules/Unit/created.js';
import '../../base-unit-yields/Rules/Unit/yield.js';
import '../../base-terrain/register.js';
import '../../base-terrain-features/register.js';
import AvailableTerrainFeatureRegistry from '../../core-terrain-features/AvailableTerrainFeatureRegistry.js';
import BasePathFinder from '../BasePathFinder.js';
import City from '../../core-city/City.js';
import Generator from '../../core-world-generator/Generator.js';
import {Militia} from '../../base-unit/Units.js';
import Player from '../../core-player/Player.js';
import TerrainRegistry from '../../core-terrain/TerrainRegistry.js';
import World from '../../core-world/World.js';
import assert from 'assert';

describe('BasePathFinder', () => {
  const ghettoWorldLoader = (schema) => {
      const Loader = class extends Generator {
        #schema;

        constructor(schema) {
          super({
            height: schema.height,
            width: schema.width,
          });

          this.#schema = schema;
        }

        generate() {
          const map = [];

          this.#schema.map.forEach(({name, features}) => {
            const [Terrain] = TerrainRegistry.getBy('name', name),
              terrain = new Terrain()
            ;

            terrain.features.push(features.map((feature) => {
              const [Feature] = AvailableTerrainFeatureRegistry.getBy('name', feature);

              return new Feature();
            }));

            map.push(terrain);
          });

          return map;
        }
      };

      const world = new World(new Loader(schema));

      world.build();

      return world;
    },
    ghettoRLELoader = (mapString) => {
      const terrainLookup = {
          A: 'Arctic',
          D: 'Desert',
          F: 'Forest',
          G: 'Grassland',
          H: 'Hills',
          J: 'Jungle',
          M: 'Mountains',
          O: 'Ocean',
          P: 'Plains',
          R: 'River',
          S: 'Swamp',
          T: 'Tundra',
        },
        featureLookup = {
          c: 'Coal',
          f: 'Fish',
          a: 'Game',
          e: 'Gems',
          g: 'Gold',
          h: 'Horse',
          i: 'Oasis',
          o: 'Oil',
          s: 'Seal',
          d: 'Shield',
        }
      ;

      return mapString
        .replace(/^\s+|\s+$/g, '')
        .match(/(\d+|)([A-Z])([a-z]+|)/g)
        // .split(/\W+/)
        .flatMap((definition) => {
          const [, n, terrain, features] = definition.match(/(\d+|)([A-Z])([a-z]+|)?/);

          return new Array(parseInt(n) || 1)
            .fill({
              name: terrainLookup[terrain],
              features: (features || '')
                .split('')
                .map((char) => featureLookup[char]),
            })
          ;
        })
      ;
    }
  ;

  it('should return the shortest path length for neighbouring tiles', () => {
    const world = ghettoWorldLoader({
        height: 10,
        width: 10,
        map: ghettoRLELoader('100Gd'),
      }),
      player = new Player(),
      startTile = world.get(3, 3),
      targetTile = world.get(4, 4),
      unit = new Militia({
        player,
        tile: startTile,
      })
    ;

    const pathFinder = new BasePathFinder(unit, startTile, targetTile),
      path = pathFinder.generate()
    ;

    assert.strictEqual(path.length, 2);
  });

  it('should find a valid path avoiding water', () => {
    const world = ghettoWorldLoader({
        height: 11,
        width: 10,
        map: ghettoRLELoader('11O8G10OG2O5G2OGOG5OGOGOG2OG2OGOGOGOGOGOGOGOGOG3OGOGOG2O3G2OGOG7OG2O7GO'),
      }),
      player = new Player(),
      startTile = world.get(1, 1),
      targetTile = world.get(5, 6),
      unit = new Militia({
        player,
        tile: startTile,
      })
    ;

    const pathFinder = new BasePathFinder(unit, startTile, targetTile),
      path = pathFinder.generate()
    ;

    assert.strictEqual(path.length, 45);
  });

  it('should correctly avoid enemy tiles and respect adjacency rules', () => {
    const world = ghettoWorldLoader({
        height: 6,
        width: 6,
        map: ghettoRLELoader('7O5GO5GO5GO5GO5G'),
      }),
      player = new Player(),
      enemy = new Player(),
      startTile = world.get(1, 1),
      targetTile = world.get(4, 4),
      unit = new Militia({
        player,
        tile: startTile,
      })
    ;

    new City({
      player: enemy,
      tile: world.get(3, 3),
    });

    new Militia({
      player: enemy,
      tile: world.get(3, 3),
    });

    const pathFinder = new BasePathFinder(unit, startTile, targetTile),
      path = pathFinder.generate()
    ;

    assert.strictEqual(path.length, 6);
  });

  it('should correctly yield no path when applicable', () => {
    const world = ghettoWorldLoader({
        height: 6,
        width: 6,
        map: ghettoRLELoader(`
          O O O O
          O G O O
          O O O O
          O O O G
        `),
      }),
      player = new Player(),
      startTile = world.get(1, 1),
      targetTile = world.get(3, 3),
      unit = new Militia({
        player,
        tile: startTile,
      })
    ;

    const pathFinder = new BasePathFinder(unit, startTile, targetTile),
      path = pathFinder.generate()
    ;

    assert.strictEqual(path, undefined);
  });

  it('should prefer routes with a lower movement cost', () => {
    const world = ghettoWorldLoader({
        height: 8,
        width: 8,
        map: ghettoRLELoader(`
          O O O O O O O O
          O G G G G G G O
          O M O O O O O G 
          O M O O O O O G 
          O M O O O O O G 
          O M O O O O O G 
          O M O O O O O G 
          O O M G G G G O 
        `),
      }),
      player = new Player(),
      startTile = world.get(1, 1),
      targetTile = world.get(2, 7),
      unit = new Militia({
        player,
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
