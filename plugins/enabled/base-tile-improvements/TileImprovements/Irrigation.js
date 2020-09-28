import {Desert, Grassland, Hills, Plains} from '../../base-terrain/Terrains.js';
import TileImprovement from '../../core-tile-improvements/TileImprovement.js';

export class Irrigation extends TileImprovement {
  // TODO: control via RulesRegistry
  cost = 1;

  // TODO: control via RulesRegistry
  static available = [
    Desert,
    Grassland,
    Hills,
    Plains,
  ];
}

export default Irrigation;
