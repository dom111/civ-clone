import * as Terrains from './Terrains.js';
import TerrainRegistry from '../core-terrain/TerrainRegistry.js';

TerrainRegistry.getInstance()
  .register(...Object.values(Terrains))
;
