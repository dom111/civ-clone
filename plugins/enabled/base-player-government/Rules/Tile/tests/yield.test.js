// import '../../../../base-terrain-yield-trade/registerYields.js';
// import '../../../../base-terrain-yields/registerYields.js';
import {Food, Production} from '../../../../base-terrain-yields/Yields.js';
import {Monarchy} from '../../../../base-governments/Governments.js';
import {Player} from '../../../../core-player/Player.js';
import PlayerGovernment from '../../../PlayerGovernment.js';
import PlayerGovernmentRegistry from '../../../PlayerGovernmentRegistry.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import StaticWorldGenerator from '../../../../base-world-generator/StaticWorldGenerator.js';
import {Trade} from '../../../../base-terrain-yield-trade/Yields.js';
import World from '../../../../core-world/World.js';
import assert from 'assert';
import baseTileYield from '../../../../base-terrain-yields/Rules/Tile/yield.js';
import featureTileYield from '../../../../base-terrain-features/Rules/Tile/yield.js';
import governmentTileYield from '../yield.js';
import tradeTileYield from '../../../../base-terrain-yield-trade/Rules/Tile/yield.js';

describe('tile:yield:monarchy', () => {
  const rulesRegistry = new RulesRegistry(),
    playerGovernmentRegistry = new PlayerGovernmentRegistry(),
    world = new World(new StaticWorldGenerator())
  ;

  world.build({
    rulesRegistry,
  });

  rulesRegistry.register(
    ...baseTileYield(),
    ...featureTileYield(),
    ...governmentTileYield({
      playerGovernmentRegistry,
    }),
    ...tradeTileYield()
  );

  const player = new Player(),
    playerGovernment = new PlayerGovernment({player})
  ;

  playerGovernment.set(new Monarchy());
  playerGovernmentRegistry.register(playerGovernment);

  [
    // Food, Production, Trade
    // [Arctic],
    [0, 0, 0],
    // [Arctic, Seal],
    [2, 0, 0],
    // [Desert],
    [0, 1, 0],
    // [Desert, Oasis],
    [3, 1, 0],
    // [Forest],
    [1, 2, 0],
    // [Forest, Horse],
    [3, 2, 0],
    // [Grassland],
    [2, 0, 0],
    // [Grassland, Shield],
    [2, 1, 0],
    // [Hills],
    [1, 0, 0],
    // [Hills, Coal],
    [1, 3, 0],
    // [Jungle],
    [1, 0, 0],
    // [Jungle, Gems],
    [1, 0, 2],
    // [Mountains],
    [0, 1, 0],
    // [Mountains, Gold],
    [0, 1, 3],
    // [Ocean],
    [1, 0, 2],
    // [Ocean, Fish],
    [3, 0, 2],
    // [Plains],
    [1, 1, 0],
    // [Plains, Game],
    [1, 3, 0],
    // [River],
    [2, 0, 1],
    // [River, Shield],
    [2, 1, 1],
    // [Swamp],
    [1, 0, 0],
    // [Swamp, Oil],
    [1, 4, 0],
    // [Tundra],
    [1, 0, 0],
    // [Tundra, Game],
    [3, 0, 0],
  ]
    .map(([food, production, trade], i) => {
      const tile = world.get(i, 0);

      [
        [Food, food],
        [Production, production],
        [Trade, trade],
      ]
        .forEach(([Yield, expectedValue]) => {
          const tileYield = new Yield();

          rulesRegistry.process('tile:yield', tileYield, tile, player);

          it(`${tile.terrain().constructor.name}${tile.terrain().features().length ? ` (${tile.terrain().features().map((feature) => feature.constructor.name).join('')})` : ''} under a Monarchy should have ${expectedValue} ${Yield.name}.`, () => {
            assert.strictEqual(
              tileYield.value(),
              expectedValue
            );
          });
        })
      ;
    })
  ;
});
