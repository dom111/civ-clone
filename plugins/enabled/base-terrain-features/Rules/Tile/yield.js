import {Coal, Fish, Game, Gems, Gold, Horse, Oasis, Oil, Seal, Shield} from '../../TerrainFeatures.js';
import {Food, Production} from '../../../base-terrain-yields/Yields.js';
import {Plains, Tundra} from '../../../base-terrain/Terrains.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import OneCriteria from '../../../core-rules/OneCriteria.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields.js';

[
  [Production, Coal, 2],
  [Food, Fish, 1],
  [Food, Game, 1, Tundra],
  [Production, Game, 1, Plains],
  [Trade, Gems, 2],
  [Trade, Gold, 3],
  [Food, Horse, 1],
  [Food, Oasis, 2],
  [Production, Oil, 3],
  [Food, Seal, 2],
  [Production, Shield, 1],
]
  .forEach(([YieldType, Feature, value, Terrain]) => {
    RulesRegistry.register(new Rule(
      `tile:yield:${[YieldType, Feature].map((entity) => entity.name.toLowerCase()).join(':')}`,
      new OneCriteria(
        new Criterion(() => ! Terrain),
        new Criterion((tileYield, tile) => tile.terrain instanceof Terrain)
      ),
      new Criterion((tileYield) => tileYield instanceof YieldType),
      new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Feature)),
      new Effect((tileYield) => tileYield.add(value))
    ));
  })
;
