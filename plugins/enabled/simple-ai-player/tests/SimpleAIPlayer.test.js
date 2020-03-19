import * as Civilizations from '../../base-civilizations/Civilizations.js';
import {Militia, Sail} from '../../base-unit/Units.js';
import AdvanceRegistry from '../../core-science/AdvanceRegistry.js';
import BasePathFinder from '../../base-world-path-finder/BasePathFinder.js';
import CityImprovementRegistry from '../../core-city-improvement/CityImprovementRegistry.js';
import CityRegistry from '../../core-city/CityRegistry.js';
import CivilizationRegistry from '../../core-civilization/CivilizationRegistry.js';
import PathFinderRegistry from '../../core-world/PathFinderRegistry.js';
import PlayerActionRegistry from '../../core-player/PlayerActionRegistry.js';
import PlayerGovernment from '../../base-player-government/PlayerGovernment.js';
import PlayerGovernmentRegistry from '../../base-player-government/PlayerGovernmentRegistry.js';
import PlayerResearch from '../../base-science/PlayerResearch.js';
import PlayerResearchRegistry from '../../base-science/PlayerResearchRegistry.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import SimpleAIPlayer from '../SimpleAIPlayer.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';
import UnitImprovementRegistry from '../../base-unit-improvements/UnitImprovementRegistry.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';
import action from '../../base-unit/Rules/Unit/action.js';
import activate from '../../base-unit-improvements/Rules/Unit/activate.js';
import assert from 'assert';
import createdYields from '../../base-unit-yields/Rules/Unit/created.js';
import getPlayers from '../../base-player/tests/lib/getPlayers.js';
import moved from '../../base-unit/Rules/Unit/moved.js';
import movementCost from '../../base-unit/Rules/Unit/movementCost.js';
import seen from '../../base-world/Rules/Tile/seen.js';
import setUpCity from '../../base-city/tests/lib/setUpCity.js';
import simpleWorldLoader from '../../base-world/tests/lib/simpleLoadWorld.js';
import start from '../../base-player/Rules/Turn/start.js';
import turnYear from '../../base-game-year/Rules/Turn/year.js';
import unitCreated from '../../base-unit/Rules/Unit/created.js';
import unitCreatedPlayer from '../../base-player/Rules/Unit/created.js';
import unitYield from '../../base-unit-yields/Rules/Unit/yield.js';
import unitsToMove from '../../base-unit/PlayerActions/unitsToMove.js';
import validateMove from '../../base-unit/Rules/Unit/validateMove.js';

global.engine = {
  emit: () => {},
  option: () => {},
};

describe('SimpleAIPlayer', () => {
  const rulesRegistry = new RulesRegistry(),
    playerGovernmentRegistry = new PlayerGovernmentRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    advanceRegistry = new AdvanceRegistry(),
    unitRegistry = new UnitRegistry(),
    cityRegistry = new CityRegistry(),
    civilizationRegistry = new CivilizationRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    unitImprovementRegistry = new UnitImprovementRegistry(),
    playerActionRegistry = new PlayerActionRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    pathFinderRegistry = new PathFinderRegistry(),
    takeTurns = ({n = 1, player} = {}) => {
      while (n--) {
        rulesRegistry.process('turn:start', player);
        rulesRegistry.process('player:turn-start', player);

        player.takeTurn({
          rulesRegistry,
          unitRegistry,
          cityRegistry,
          playerGovernmentRegistry,
          playerResearchRegistry,
          unitImprovementRegistry,
          tileImprovementRegistry,
          pathFinderRegistry,
        });
      }
    },
    createPlayers = ({
      n = 1,
    } = {}) => new Array(n)
      .fill(0)
      .map(() => {
        const player = new SimpleAIPlayer({
            playerActionRegistry,
            rulesRegistry,
          }),
          availableCivilizations = civilizationRegistry.entries()
        ;

        player.chooseCivilization(availableCivilizations);

        civilizationRegistry.unregister(player.civilization.constructor);

        playerGovernmentRegistry.register(new PlayerGovernment({
          player,
          rulesRegistry,
        }));

        playerResearchRegistry.register(new PlayerResearch({
          advanceRegistry,
          player,
          rulesRegistry,
        }));

        return player;
      })
  ;

  rulesRegistry.register(
    ...action({
      cityRegistry,
      rulesRegistry,
      tileImprovementRegistry,
      unitRegistry,
    }),
    ...activate({
      unitImprovementRegistry,
    }),
    ...movementCost(),
    ...validateMove(),
    ...createdYields(),
    ...moved(),
    ...seen(),
    ...start({
      cityRegistry,
      rulesRegistry,
      unitRegistry,
    }),
    ...turnYear(),
    ...unitCreated({
      unitRegistry,
    }),
    ...unitCreatedPlayer(),
    ...unitYield()
  );

  playerActionRegistry.register(
    ...unitsToMove({
      unitRegistry,
    })
  );

  civilizationRegistry.register(
    ...Object.values(Civilizations)
  );

  pathFinderRegistry.register(BasePathFinder);

  it('should move land units around to explore the available map', () => {
    const world = simpleWorldLoader('5O3GO3GO3G'),
      [player] = createPlayers(),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: world.get(1, 1),
      })
    ;

    assert.strictEqual(player.seenTiles.length, 9);

    unitRegistry.register(unit);

    takeTurns({
      n: 3,
      player,
      world,
    });

    assert.strictEqual(player.seenTiles.length, 16);

    unitRegistry.unregister(unit);
  });

  it('should move naval units around to explore the available map', () => {
    const world = simpleWorldLoader('16O'),
      [player] = createPlayers(),
      unit = new Sail({
        player,
        rulesRegistry,
        tile: world.get(1, 1),
      })
    ;

    assert.strictEqual(player.seenTiles.length, 9);

    unitRegistry.register(unit);

    takeTurns({
      player,
      world,
    });

    assert.strictEqual(player.seenTiles.length, 16);

    unitRegistry.unregister(unit);
  });

  it('should embark land units onto naval transport units', () => {
    const world = simpleWorldLoader('6OG18O'),
      [player] = createPlayers(),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: world.get(1, 1),
      }),
      transport = new Sail({
        player,
        rulesRegistry,
        tile: world.get(2, 2),
      })
    ;

    unitRegistry.register(unit, transport);

    takeTurns({
      player,
      world,
    });

    assert.notStrictEqual(unit.tile, world.get(1, 1));
    assert.notStrictEqual(transport.tile, world.get(2, 2));

    unitRegistry.unregister(unit, transport);
  });

  it('should disembark land units from naval transport units', () => {
    const world = simpleWorldLoader('5OG10O'),
      [player] = createPlayers(),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: world.get(2, 2),
      }),
      transport = new Sail({
        player,
        rulesRegistry,
        tile: world.get(2, 2),
      })
    ;

    transport.stow(unit);

    unit.busy = Infinity;
    unit.active = false;

    unitRegistry.register(transport, unit);

    takeTurns({
      player,
      world,
    });

    assert.strictEqual(unit.tile, world.get(1, 1));
    assert.strictEqual(player.seenTiles.length, 16);

    unitRegistry.unregister(unit, transport);
  });

  it('should set a path to a capturable enemy city', () => {
    const world = simpleWorldLoader(`
      O O O O O O
      O G G G G O
      O O O O O G
      O O G G G O
      O G O O O O
      O O G G G G
    `),
      [player] = createPlayers(),
      [enemy] = getPlayers({
        rulesRegistry,
      }),
      unit = new Militia({
        player,
        rulesRegistry,
        tile: world.get(1, 1),
      }),
      city = setUpCity({
        cityImprovementRegistry,
        player: enemy,
        rulesRegistry,
        size: 2,
        tile: world.get(5, 5),
        tileImprovementRegistry,
        world,
      })
    ;

    player.seenTiles.push(...world.getBy(() => true));

    unitRegistry.register(unit);
    cityRegistry.register(city);

    takeTurns({
      n: 13,
      player,
      world,
    });

    assert.strictEqual(unit.tile, city.tile);
    assert.strictEqual(city.player, player);

    unitRegistry.unregister(unit);
    cityRegistry.unregister(city);
  });
});
