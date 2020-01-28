import {Irrigation, Mine, Pollution, Railroad, Road} from './Improvements.js';
import TerrainImprovementRegistry from '../core-terrain-improvements/TerrainImprovementRegistry.js';

[
  Irrigation,
  Mine,
  Pollution,
  Railroad,
  Road,
]
  .forEach((TerrainImprovement) => TerrainImprovementRegistry.register(TerrainImprovement))
;
