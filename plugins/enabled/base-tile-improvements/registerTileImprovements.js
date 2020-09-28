import * as TileImprovements from './TileImprovements.js';
import TileImprovementRegistry from '../core-tile-improvements/TileImprovementRegistry.js';

TileImprovementRegistry.getInstance()
  .register(...Object.values(TileImprovements))
;
