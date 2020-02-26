import {Desert, Hills, Mountains} from '../../base-terrain/Terrains.js';
import TileImprovement from '../../core-tile-improvements/TileImprovement.js';

export class Mine extends TileImprovement {
  // TODO: control via RulesRegistry
  cost = 3;

  // TODO: control via RulesRegistry
  static available = [
    Desert,
    Hills,
    Mountains,
  ];
}

export default Mine;
