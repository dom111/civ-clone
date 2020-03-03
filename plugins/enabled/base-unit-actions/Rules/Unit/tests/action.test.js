import '../../../../base-city/Rules/City/created.js';
import '../../../../base-city/Rules/City/captured.js';
import '../../../../base-science/Rules/Research/cost.js';
import '../../../../base-terrain/register.js';
import '../../../../base-tile-improvements/Rules/Tile/improvement.js';
import '../../../../base-unit-yields/Rules/Unit/created.js';
import '../action.js';
import '../validateMove.js';
import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  River,
  Swamp,
  Tundra,
} from '../../../../base-terrain/Terrains.js';
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
  FoundCity,
  Move,
  PlantForest,
} from '../../../Actions.js';
import {Militia, Settlers} from '../../../../base-unit/Units.js';
import {BridgeBuilding} from '../../../../base-science/Advances.js';
import City from '../../../../core-city/City.js';
import FillGenerator from '../../../../base-world-generator/FillGenerator.js';
import Player from '../../../../core-player/Player.js';
import PlayerRegistry from '../../../../base-player/PlayerRegistry.js';
import PlayerResearch from '../../../../base-science/PlayerResearch.js';
import PlayerResearchRegistry from '../../../../base-science/PlayerResearchRegistry.js';
import {Research} from '../../../../base-science/Yields.js';
import TerrainRegistry from '../../../../core-terrain/TerrainRegistry.js';
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
    [BuildIrrigation, Desert, Grassland, Hills, Plains, River],
    [BuildMine, Desert, Hills, Mountains],
    [BuildRoad, Arctic, Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, Swamp, Tundra],
    [ClearForest, Forest],
    [ClearJungle, Jungle],
    [ClearSwamp, Swamp],
    [FoundCity, Arctic, Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, River, Swamp, Tundra],
    [PlantForest, Plains],
  ]
    .forEach(([Action, ...validTerrains]) => {
      validTerrains.forEach((Terrain) => {
        it(`should be possible for Settlers to ${Action.name} on ${Terrain.name}`, () => {
          const world = generateWorld(Terrain);

          world.get(3, 4)
            .terrain = new Ocean()
          ;

          const [player] = addPlayers(),
            unit = new Settlers({
              player,
              tile: world.get(4, 4),
            }),
            [action] = unit.actions(unit.tile)
              .filter((action) => action instanceof Action)
          ;

          assert(action);
        });
      });

      TerrainRegistry.filter((Terrain) => ! validTerrains.includes(Terrain))
        .forEach((Terrain) => {
          it(`should not be possible for Settlers to ${Action.name} on ${Terrain.name}`, () => {
            const world = generateWorld(Terrain),
              [player] = addPlayers(),
              unit = new Settlers({
                player,
                tile: world.get(4, 4),
              }),
              [action] = unit.actions(unit.tile)
                .filter((action) => action instanceof Action)
            ;

            assert(! action);
          });
        })
      ;
    })
  ;

  [
    [BuildRoad, BridgeBuilding, River],
  ]
    .forEach(([Action, Advance, Terrain]) => {
      it(`should not be possible for Settlers to ${Action.name} on ${Terrain.name} before discovering ${Advance.name}`, () => {
        const world = generateWorld(Terrain),
          [player] = addPlayers(),
          unit = new Settlers({
            player,
            tile: world.get(4, 4),
          })
        ;

        assert(! unit.actions(unit.tile)
          .some((action) => action instanceof Action)
        );
      });

      it(`should be possible for Settlers to ${Action.name} on ${Terrain.name} after discovering ${Advance.name}`, () => {
        const world = generateWorld(Terrain),
          [player] = addPlayers(),
          unit = new Settlers({
            player,
            tile: world.get(4, 4),
          }),
          playerResearch = new PlayerResearch(player)
        ;

        // TODO: have this wrapped to make it easier
        PlayerResearchRegistry.register(playerResearch);
        playerResearch.research(BridgeBuilding);
        playerResearch.add(new Research(60));
        playerResearch.check();

        assert(unit.actions(unit.tile)
          .some((action) => action instanceof Action)
        );
      });
    })
  ;
});
