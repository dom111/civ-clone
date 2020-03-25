import {Food, Production} from '../../../../base-terrain-yields/Yields.js';
import RulesRegistry from '../../../../core-rules/RulesRegistry.js';
import StaticWorldGenerator from '../../../../base-world-generator/StaticWorldGenerator.js';
import {Trade} from '../../../Yields.js';
import World from '../../../../core-world/World.js';
import assert from 'assert';
import tileFeatureYield from '../../../../base-terrain-features/Rules/Tile/yield.js';
import tileTradeYield from '../yield.js';
import tileYield from '../../../../base-terrain-yields/Rules/Tile/yield.js';

describe('tile:yield', () => {
  const rulesRegistry = new RulesRegistry(),
    world = new World(new StaticWorldGenerator())
  ;

  rulesRegistry.register(
    ...tileYield(),
    ...tileTradeYield(),
    ...tileFeatureYield()
  );

  world.build({
    rulesRegistry,
  });

  const tests = [],
    expectedData = [
      // Food, Production, Trade
      // [Arctic],
      [0, 0, 0],
      // [Arctic, Seal],
      [2, 0, 0],
      // [Desert],
      [0, 1, 0],
      // [Desert, Oasis],
      [2, 1, 0],
      // [Forest],
      [1, 2, 0],
      // [Forest, Horse],
      [2, 2, 0],
      // [Grassland],
      [2, 0, 0],
      // [Grassland, Shield],
      [2, 1, 0],
      // [Hills],
      [1, 0, 0],
      // [Hills, Coal],
      [1, 2, 0],
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
      [2, 0, 2],
      // [Plains],
      [1, 1, 0],
      // [Plains, Game],
      [1, 2, 0],
      // [River],
      [2, 0, 1],
      // [River, Shield],
      [2, 1, 1],
      // [Swamp],
      [1, 0, 0],
      // [Swamp, Oil],
      [1, 3, 0],
      // [Tundra],
      [1, 0, 0],
      // [Tundra, Game],
      [2, 0, 0],
    ]
      .map(([food, production, trade]) => [
        [Food, food],
        [Production, production],
        [Trade, trade],
      ])
  ;

  for (let i = 0; i < 24; i++) {
    const tile = world.get(i, 0),
      yields = tile.yields({
        yields: [Food, Production, Trade],
      })
    ;

    yields.forEach((tileYield) => {
      const [value] = expectedData[i]
        .filter(([Yield]) => tileYield instanceof Yield)
        .map(([, value]) => value)
      ;

      it(`${tile.terrain().constructor.name}${tile.terrain().features().length ? ` (${tile.terrain().features().map((feature) => feature.constructor.name).join('')})` : ''} should have ${value} ${tileYield.constructor.name}.`, () => {
        assert.strictEqual(
          tileYield.value(),
          value
        );
      });
    });
  }

  return tests;
});
