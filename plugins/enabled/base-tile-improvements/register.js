import {Irrigation, Mine, Pollution, Railroad, Road} from './TileImprovements.js';
import TileImprovementRegistry from '../core-tile-improvements/TileImprovementRegistry.js';

[
  Irrigation,
  Mine,
  Pollution,
  Railroad,
  Road,
]
  .forEach((TerrainImprovement) => TileImprovementRegistry.register(TerrainImprovement))
;
