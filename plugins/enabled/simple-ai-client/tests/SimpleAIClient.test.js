import * as Civilizations from '../../base-civilizations-civ1/Civilizations.js';
import AdvanceRegistry from '../../core-science/AdvanceRegistry.js';
import BasePathFinder from '../../base-world-path-finder/BasePathFinder.js';
import CityImprovementRegistry from '../../core-city-improvement/CityImprovementRegistry.js';
import CityRegistry from '../../core-city/CityRegistry.js';
import CivilizationRegistry from '../../core-civilization/CivilizationRegistry.js';
import PathFinderRegistry from '../../core-world/PathFinderRegistry.js';
import Player from '../../core-player/Player.js';
import PlayerGovernment from '../../base-player-government/PlayerGovernment.js';
import PlayerGovernmentRegistry from '../../base-player-government/PlayerGovernmentRegistry.js';
import PlayerResearch from '../../base-science/PlayerResearch.js';
import PlayerResearchRegistry from '../../base-science/PlayerResearchRegistry.js';
import RulesRegistry from '../../core-rules-registry/RulesRegistry.js';
import {Sail} from '../../base-unit-transport/Units.js';
import SimpleAIClient from '../SimpleAIClient.js';
import TileImprovementRegistry from '../../core-tile-improvements/TileImprovementRegistry.js';
import TransportRegistry from '../../base-unit-transport/TransportRegistry.js';
import UnitImprovementRegistry from '../../base-unit-improvements/UnitImprovementRegistry.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';
import {Warrior} from '../../base-units-civ1/Units.js';
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
import transportAction from '../../base-unit-transport/Rules/Unit/action.js';
import transportMoved from '../../base-unit-transport/Rules/Unit/moved.js';
import transportMovementCost from '../../base-unit-transport/Rules/Unit/movementCost.js';
import transportYield from '../../base-unit-transport/Rules/Unit/yield.js';
import turnYear from '../../base-game-year/Rules/Turn/year.js';
import unitCreated from '../../base-unit/Rules/Unit/created.js';
import unitCreatedPlayer from '../../base-player/Rules/Unit/created.js';
import unitsToMove from '../../base-unit/Rules/Player/action.js';
import validateMove from '../../base-unit/Rules/Unit/validateMove.js';
import warriorUnitYield from '../../base-unit-warrior/Rules/Unit/yield.js';
import warriorYield from '../../base-unit-warrior/Rules/Unit/yield.js';

describe('SimpleAIClient', () => {
  const rulesRegistry = new RulesRegistry(),
    playerGovernmentRegistry = new PlayerGovernmentRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    advanceRegistry = new AdvanceRegistry(),
    transportRegistry = new TransportRegistry(),
    unitRegistry = new UnitRegistry(),
    cityRegistry = new CityRegistry(),
    civilizationRegistry = new CivilizationRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    unitImprovementRegistry = new UnitImprovementRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    pathFinderRegistry = new PathFinderRegistry(),
    takeTurns = ({n = 1, client, callable = () => {}} = {}) => {
      while (n--) {
        const player = client.player();

        rulesRegistry.process('turn:start', player);
        rulesRegistry.process('player:turn-start', player);

        client.takeTurn({
          cityRegistry,
          pathFinderRegistry,
          playerGovernmentRegistry,
          playerResearchRegistry,
          rulesRegistry,
          tileImprovementRegistry,
          unitImprovementRegistry,
          unitRegistry,
        });

        callable();
      }
    },
    createPlayers = ({
      n = 1,
    } = {}) => new Array(n)
      .fill(0)
      .map(() => {
        const player = new Player({
            rulesRegistry,
          }),
          client = new SimpleAIClient({
            player,
          }),
          availableCivilizations = civilizationRegistry.entries()
        ;

        client.chooseCivilization(availableCivilizations);

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

        return client;
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
    ...warriorYield(),
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
    ...transportAction({
      rulesRegistry,
      transportRegistry,
      unitRegistry,
    }),
    ...transportMoved({
      transportRegistry,
    }),
    ...transportMovementCost({
      transportRegistry,
    }),
    ...transportYield(),
    ...turnYear(),
    ...unitCreated({
      unitRegistry,
    }),
    ...unitCreatedPlayer(),
    ...unitsToMove({
      unitRegistry,
    }),
    ...warriorUnitYield()
  );

  civilizationRegistry.register(
    ...Object.values(Civilizations)
  );

  pathFinderRegistry.register(BasePathFinder);

  it('should move land units around to explore the available map', () => {
    const world = simpleWorldLoader('5O3GO3GO3G'),
      [client] = createPlayers(),
      player = client.player()
    ;

    assert.strictEqual(player.seenTiles().length, 0);

    const unit = new Warrior({
      player,
      rulesRegistry,
      tile: world.get(1, 1),
    })
    ;

    assert.strictEqual(unit.visibility().value(), 1);

    assert.strictEqual(player.seenTiles().length, 9);

    unitRegistry.register(unit);

    takeTurns({
      n: 3,
      client,
      world,
    });

    assert.strictEqual(player.seenTiles().length, 16);

    unitRegistry.unregister(unit);
  });

  it('should move naval units around to explore the available map', () => {
    const world = simpleWorldLoader('16O'),
      [client] = createPlayers(),
      player = client.player(),
      unit = new Sail({
        player,
        rulesRegistry,
        tile: world.get(1, 1),
        transportRegistry,
      })
    ;

    assert.strictEqual(player.seenTiles().length, 9);

    unitRegistry.register(unit);

    takeTurns({
      client,
      world,
    });

    assert.strictEqual(player.seenTiles().length, 16);

    unitRegistry.unregister(unit);
  });

  it('should embark land units onto naval transport units', () => {
    const world = simpleWorldLoader('6OG18O'),
      [client] = createPlayers(),
      player = client.player(),
      unit = new Warrior({
        player,
        rulesRegistry,
        tile: world.get(1, 1),
      }),
      transport = new Sail({
        player,
        rulesRegistry,
        tile: world.get(2, 2),
        transportRegistry,
      })
    ;

    unitRegistry.register(unit, transport);

    takeTurns({
      client,
      world,
    });

    assert.notStrictEqual(unit.tile(), world.get(1, 1));
    assert.notStrictEqual(transport.tile(), world.get(2, 2));

    unitRegistry.unregister(unit, transport);
  });

  it('should disembark land units from naval transport units', () => {
    const world = simpleWorldLoader('5OG10O'),
      [client] = createPlayers(),
      player = client.player(),
      unit = new Warrior({
        player,
        rulesRegistry,
        tile: world.get(2, 2),
      }),
      transport = new Sail({
        player,
        rulesRegistry,
        tile: world.get(2, 2),
        transportRegistry,
      })
    ;

    unitRegistry.register(transport, unit);

    transport.stow({
      unit,
    });

    takeTurns({
      client,
      world,
    });

    assert.strictEqual(unit.tile(), world.get(1, 1));
    assert.strictEqual(player.seenTiles().length, 16);

    unitRegistry.unregister(unit, transport);
  });

  it('should set a path to a capturable enemy city', () => {
    const world = simpleWorldLoader('7O4G6OG2O3G2OG6O4G'),
      [client] = createPlayers(),
      player = client.player(),
      [enemy] = getPlayers({
        rulesRegistry,
      }),
      unit = new Warrior({
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

    player.seenTiles()
      .push(...world.entries())
    ;

    unitRegistry.register(unit);
    cityRegistry.register(city);

    takeTurns({
      n: 13,
      client,
      world,
    });

    assert.strictEqual(unit.tile(), city.tile());
    assert.strictEqual(city.player(), player);

    unitRegistry.unregister(unit);
    cityRegistry.unregister(city);
  });
});
