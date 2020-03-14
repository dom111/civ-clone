import {Desert, Hills, Mountains, Plains} from '../../../base-terrain/Terrains.js';
import {Food, Production} from '../../../base-terrain-yields/Yields.js';
import {Irrigation, Mine} from '../../TileImprovements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

export const getRules = ({
  tileImprovementRegistry = TileImprovementRegistry.getInstance(),
} = {}) => [
  ...[
    [Desert, Food, Irrigation, 1],
    [Desert, Production, Mine, 1],
    [Hills, Food, Irrigation, 1],
    [Hills, Production, Mine, 2],
    [Mountains, Production, Mine, 2],
    [Plains, Food, Irrigation, 1],
  ]
    .map(([Terrain, YieldType, Improvement, value]) => new Rule(
      `tile:yield:${[YieldType, Terrain, Improvement].map((entity) => entity.name.toLowerCase()).join(':')}`,
      new Criterion((tileYield) => tileYield instanceof YieldType),
      new Criterion((tileYield, tile) => tile.terrain instanceof Terrain),
      new Criterion((tileYield, tile) => tileImprovementRegistry.getBy('tile', tile)
        .some((improvement) => improvement instanceof Improvement)
      ),
      new Effect((tileYield) => tileYield.add(value))
    ))
  ,
];

export default getRules;