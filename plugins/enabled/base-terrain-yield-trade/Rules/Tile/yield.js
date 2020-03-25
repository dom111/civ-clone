import {Desert, Grassland, Ocean, Plains, River} from '../../../base-terrain/Terrains.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {High} from '../../../core-rules/Priorities.js';
import {Road} from '../../../base-tile-improvements/TileImprovements.js';
import Rule from '../../../core-rules/Rule.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';
import {Trade} from '../../Yields.js';

export const getRules = ({
  tileImprovementRegistry = TileImprovementRegistry.getInstance(),
} = {}) => [
  ...[
    Desert,
    Grassland,
    Plains,
  ]
    .map((Terrain) => new Rule(
      `tile:yield:trade:${Terrain.name.toLowerCase()}:road`,
      new High(),
      new Criterion((tileYield) => tileYield instanceof Trade),
      new Criterion((tileYield, tile) => tile.terrain() instanceof Terrain),
      new Criterion((tileYield, tile) => tileImprovementRegistry.getBy('tile', tile)
        .some((improvement) => improvement instanceof Road)
      ),
      new Effect((tileYield) => tileYield.add(1))
    ))
  ,

  new Rule(
    'tile:yield:trade:ocean',
    new High(),
    new Criterion((tileYield) => tileYield instanceof Trade),
    new Criterion((tileYield, tile) => tile.terrain() instanceof Ocean),
    new Effect((tileYield) => tileYield.add(2))
  ),

  new Rule(
    'tile:yield:trade:river',
    new High(),
    new Criterion((tileYield) => tileYield instanceof Trade),
    new Criterion((tileYield, tile) => tile.terrain() instanceof River),
    new Effect((tileYield) => tileYield.add(1))
  ),
];

export default getRules;
