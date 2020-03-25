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
import {Militia, Settlers} from '../../../Units.js';
import {BridgeBuilding} from '../../../../base-science/Advances.js';
import City from '../../../../core-city/City.js';
import CityRegistry from '../../../../core-city/CityRegistry.js';
import PlayerResearch from '../../../../base-science/PlayerResearch.js';
import PlayerResearchRegistry from '../../../../base-science/PlayerResearchRegistry.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import TerrainRegistry from '../../../../core-terrain/TerrainRegistry.js';
import TileImprovementRegistry from '../../../../core-tile-improvements/TileImprovementRegistry.js';
import UnitRegistry from '../../../../core-unit/UnitRegistry.js';
import action from '../action.js';
import addPlayers from '../../../../base-player/tests/lib/getPlayers.js';
import assert from 'assert';
import generateFixedWorld from '../../../../base-world/tests/lib/generateFixedWorld.js';
import improvement from '../../../../base-tile-improvements/Rules/Tile/improvement.js';
import movementCost from '../../../../base-unit/Rules/Unit/movementCost.js';
import unitCreated from '../../../../base-unit/Rules/Unit/created.js';
import unitCreatedYields from '../../../../base-unit-yields/Rules/Unit/created.js';
import unitYield from '../../../../base-unit-yields/Rules/Unit/yield.js';
import validateMove from '../validateMove.js';

describe('unit:action', () => {
  const rulesRegistry = new RulesRegistry(),
    cityRegistry = new CityRegistry(),
    terrainRegistry = new TerrainRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    unitRegistry = new UnitRegistry(),
    getUnit = ({Unit = Militia, player, tile}) => new Unit({
      player,
      rulesRegistry,
      tile,
    })
  ;

  rulesRegistry.register(
    ...improvement({
      playerResearchRegistry,
      tileImprovementRegistry,
    }),
    ...unitCreated({
      unitRegistry,
    }),
    ...unitCreatedYields(),
    ...unitYield(),
    ...action({
      cityRegistry,
      rulesRegistry,
      tileImprovementRegistry,
      unitRegistry,
    }),
    ...validateMove(),
    ...movementCost()
  );

  terrainRegistry.register(
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
    Tundra
  );

  it('should be able to attack enemy unit next to it', () => {
    const world = generateFixedWorld(),
      [player, enemy] = addPlayers({
        n: 2,
      }),
      unit = getUnit({
        player,
        tile: world.get(0, 0),
      }),
      enemyUnit = getUnit({
        player: enemy,
        tile: world.get(1, 0),
      })
    ;

    const actions = unit.actions(enemyUnit.tile());

    assert(actions.some((action) => action instanceof Attack));
  });

  it('should be able to fortify', () => {
    const world = generateFixedWorld(),
      [player] = addPlayers(),
      unit = getUnit({
        player,
        tile: world.get(0, 0),
      })
    ;

    assert(unit.actions()
      .some((action) => action instanceof Fortify)
    );
  });

  it('should not be able to move adjacent to an enemy unit', () => {
    const world = generateFixedWorld(),
      [player, enemy] = addPlayers({
        n: 2,
      }),
      unit = getUnit({
        player,
        tile: world.get(0, 0),
      })
    ;

    getUnit({
      player: enemy,
      tile: world.get(1, 0),
    });

    [
      world.get(0, 1),
      world.get(0, 4),
      world.get(1, 0),
      world.get(1, 4),
    ]
      .forEach((destination) => {
        assert(unit.actions(destination)
          .every((action) => ! (action instanceof Move))
        );
      })
    ;
  });

  it('should be able to move away from enemy unit', () => {
    const world = generateFixedWorld(),
      [player, enemy] = addPlayers({
        n: 2,
      }),
      unit = getUnit({
        player,
        tile: world.get(0, 0),
      })
    ;

    getUnit({
      player: enemy,
      tile: world.get(1, 0),
    });

    [
      world.get(4, 4),
      world.get(4, 0),
      world.get(4, 1),
    ]
      .forEach((destination) => {
        assert(unit.actions(destination)
          .some((action) => action instanceof Move)
        );
      })
    ;
  });

  it('should be possible to capture an unprotected enemy city', () => {
    const world = generateFixedWorld(),
      [player, enemy] = addPlayers({
        n: 2,
      }),
      unit = getUnit({
        player,
        tile: world.get(1, 1),
      }),
      city = new City({
        player: enemy,
        tile: world.get(2, 2),
      })
    ;

    cityRegistry.register(city);

    const [captureCity] = unit.actions(city.tile())
      .filter((action) => action instanceof CaptureCity)
    ;

    assert(captureCity);

    assert.strictEqual(city.player(), enemy);

    unit.action({
      action: captureCity,
    });

    assert.strictEqual(city.player(), player);

    cityRegistry.unregister(city);
  });

  it('should not be possible to capture a protected enemy city', () => {
    const world = generateFixedWorld(),
      [player, enemy] = addPlayers({
        n: 2,
      }),
      unit = getUnit({
        player,
        tile: world.get(1, 1),
      }),
      city = new City({
        player: enemy,
        tile: world.get(2, 2),
      })
    ;

    cityRegistry.register(city);

    getUnit({
      player: enemy,
      tile: world.get(2, 2),
    });

    const [captureCity] = unit.actions(city.tile())
      .filter((action) => action instanceof CaptureCity)
    ;

    assert(! captureCity);

    cityRegistry.unregister(city);
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
          const world = generateFixedWorld({
            Terrain,
          });

          world.get(3, 4)
            .setTerrain(new Ocean())
          ;

          const [player] = addPlayers(),
            unit = getUnit({
              Unit: Settlers,
              player,
              tile: world.get(4, 4),
            }),
            [action] = unit.actions()
              .filter((action) => action instanceof Action)
          ;

          assert(action);
        });
      });

      terrainRegistry.filter((Terrain) => ! validTerrains.includes(Terrain))
        .forEach((Terrain) => {
          it(`should not be possible for Settlers to ${Action.name} on ${Terrain.name}`, () => {
            const world = generateFixedWorld({
                Terrain,
              }),
              [player] = addPlayers(),
              unit = getUnit({
                Unit: Settlers,
                player,
                tile: world.get(4, 4),
              }),
              [action] = unit.actions()
                .filter((action) => action instanceof Action)
            ;

            assert(! action);
          });
        })
      ;
    })
  ;

  [
    Desert,
    Grassland,
    Hills,
    Plains,
  ]
    .forEach((Terrain) => {
      it(`should not be possible for Settlers to BuildIrrigation on ${Terrain.name} without access to water`, () => {
        const world = generateFixedWorld({
            Terrain,
          }),
          [player] = addPlayers(),
          unit = getUnit({
            Unit: Settlers,
            player,
            tile: world.get(4, 4),
          })
        ;

        assert(! unit.actions()
          .some((action) => action instanceof BuildIrrigation)
        );
      });
    })
  ;

  [
    [BuildRoad, BridgeBuilding, River],
  ]
    .forEach(([Action, Advance, Terrain]) => {
      it(`should not be possible for Settlers to ${Action.name} on ${Terrain.name} before discovering ${Advance.name}`, () => {
        const world = generateFixedWorld({
            Terrain,
          }),
          [player] = addPlayers(),
          unit = getUnit({
            Unit: Settlers,
            player,
            tile: world.get(4, 4),
          })
        ;

        assert(! unit.actions()
          .some((action) => action instanceof Action)
        );
      });

      it(`should be possible for Settlers to ${Action.name} on ${Terrain.name} after discovering ${Advance.name}`, () => {
        const world = generateFixedWorld({
            Terrain,
          }),
          [player] = addPlayers(),
          unit = getUnit({
            Unit: Settlers,
            player,
            tile: world.get(4, 4),
          }),
          playerResearch = new PlayerResearch({player, rulesRegistry})
        ;

        playerResearchRegistry.register(playerResearch);
        playerResearch.complete().push(new BridgeBuilding());

        assert(unit.actions()
          .some((action) => action instanceof Action)
        );
      });
    })
  ;
});
