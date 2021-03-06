import {
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  River, Swamp, Tundra,
} from '../../../base-terrain/Terrains.js';
import {Food, Production} from '../../Yields.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  ...[
    [Food, Forest, 1],
    [Food, Grassland, 2],
    [Food, Hills, 1],
    [Food, Jungle, 1],
    [Food, Ocean, 1],
    [Food, Plains, 1],
    [Food, River, 2],
    [Food, Swamp, 1],
    [Food, Tundra, 1],
    [Production, Desert, 1],
    [Production, Forest, 2],
    [Production, Mountains, 1],
    [Production, Plains, 1],
  ]
    .map(([YieldType, TerrainType, value]) => new Rule(
      `tile:yield:${[YieldType, TerrainType].map((entity) => entity.name.toLowerCase()).join(':')}`,
      new Criterion((tileYield) => tileYield instanceof YieldType),
      new Criterion((tileYield, tile) => tile.terrain() instanceof TerrainType),
      new Effect((tileYield) => tileYield.add(value))
    ))
  ,
];

export default getRules;
