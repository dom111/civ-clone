import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../Yields.js';
import {Jungle} from '../../../base-terrain/Terrains.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [Food, Jungle, 1],
]
  .forEach(([YieldType, TerrainType, value]) => {
    RulesRegistry.register(new Rule(
      `tile:yield:${[YieldType, TerrainType].map((entity) => entity.name.toLowerCase()).join(':')}`,
      new Criterion((tileYield) => tileYield instanceof YieldType),
      new Criterion((tileYield, tile) => tile.terrain instanceof TerrainType),
      new Effect((tileYield) => tileYield.add(value))
    ));
  })
;
