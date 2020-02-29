import '../../../../base-city/Rules/City/created.js';
import '../../../../base-unit-yields/Rules/Unit/created.js';
import '../action.js';
import {
  Attack,
  BuildIrrigation,
  BuildMine,
  BuildRoad,
  CaptureCity,
  ClearForest,
  ClearJungle,
  ClearSwamp,
  Fortify,
  Move,
  PlantForest,
} from '../../../Actions.js';
import {Forest, Grassland, Hills, Jungle, Plains, River, Swamp} from '../../../../base-terrain/Terrains.js';
import {Militia, Settlers} from '../../../../base-unit/Units.js';
import City from '../../../../core-city/City.js';
import FillGenerator from '../../../../base-world-generator/FillGenerator.js';
import Player from '../../../../core-player/Player.js';
import PlayerRegistry from '../../../../base-player/PlayerRegistry.js';
import World from '../../../../core-world/World.js';
import assert from 'assert';

describe('Unit:actions', () => {
  const generateWorld = (Terrain = Grassland) => {
      const world = new World(new FillGenerator({
        height: 10,
        width: 10,
        Terrain,
      }));

      world.build();

      return world;
    },
    addPlayers = () => [
      new Player(),
      new Player(),
    ]
      .map((player) => {
        PlayerRegistry.register(player);

        return player;
      })
  ;

  it('should be able to attack enemy unit next to it', () => {
    const world = generateWorld(),
      [player1, player2] = addPlayers(),
      unit1 = new Militia({
        player: player1,
        tile: world.get(0, 0),
      }),
      unit2 = new Militia({
        player: player2,
        tile: world.get(1, 0),
      })
    ;

    const actions = unit1.actions(unit2.tile);

    assert(actions.some((action) => action instanceof Attack));
  });

  it('should be able to fortify', () => {
    const world = generateWorld(),
      [player] = addPlayers(),
      unit = new Militia({
        player,
        tile: world.get(0, 0),
      })
    ;

    assert(unit.actions()
      .some((action) => action instanceof Fortify)
    );
  });

  it('should not be able to move adjacent to an enemy unit', () => {
    const world = generateWorld(),
      [player1, player2] = addPlayers(),
      unit = new Militia({
        player: player1,
        tile: world.get(0, 0),
      })
    ;

    new Militia({
      player: player2,
      tile: world.get(1, 0),
    });

    [
      world.get(0, 1),
      world.get(0, 9),
      world.get(1, 0),
      world.get(1, 9),
    ]
      .forEach((destination) => {
        assert(unit.actions(destination)
          .every((action) => ! (action instanceof Move))
        );
      })
    ;
  });

  it('should be able to move away from enemy unit', () => {
    const world = generateWorld(),
      [player1, player2] = addPlayers(),
      unit = new Militia({
        player: player1,
        tile: world.get(0, 0),
      })
    ;

    new Militia({
      player: player2,
      tile: world.get(1, 0),
    });

    [
      world.get(9, 9),
      world.get(9, 0),
      world.get(9, 1),
    ]
      .forEach((destination) => {
        assert(unit.actions(destination)
          .some((action) => action instanceof Move)
        );
      })
    ;
  });

  it('should be possible to capture an unprotected enemy city', () => {
    const world = generateWorld(),
      [player1, player2] = addPlayers(),
      unit = new Militia({
        player: player1,
        tile: world.get(4, 4),
      }),
      city = new City({
        player: player2,
        tile: world.get(5, 5),
      }),
      [captureCity] = unit.actions(city.tile)
        .filter((action) => action instanceof CaptureCity)
    ;

    assert(captureCity);

    assert.strictEqual(city.player, player2);

    unit.action(captureCity);

    assert.strictEqual(city.player, player1);
  });

  it('should not be possible to capture a protected enemy city', () => {
    const world = generateWorld(),
      [player1, player2] = addPlayers(),
      unit = new Militia({
        player: player1,
        tile: world.get(4, 4),
      }),
      city = new City({
        player: player2,
        tile: world.get(5, 5),
      })
    ;

    new Militia({
      player: player2,
      tile: world.get(5, 5),
    });

    const [captureCity] = unit.actions(city.tile)
      .filter((action) => action instanceof CaptureCity)
    ;

    assert(! captureCity);
  });

  [
    [BuildIrrigation, River],
    [BuildMine, Hills],
    [BuildRoad, Grassland],
    [ClearForest, Forest],
    [ClearJungle, Jungle],
    [ClearSwamp, Swamp],
    [PlantForest, Plains],
  ]
    .forEach(([Action, Terrain]) => {
      it(`should be possible for Settlers to ${Action.name} on ${Terrain.name}`, () => {
        const world = generateWorld(Terrain),
          [player] = addPlayers(),
          unit = new Settlers({
            player,
            tile: world.get(4, 4),
          })
        ;

        const [action] = unit.actions(unit.tile)
          .filter((action) => action instanceof Action)
        ;

        assert(action);
      });
    })
  ;
});
