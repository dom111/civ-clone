import {Arctic, Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, River, Swamp, Tundra} from '../../base-terrain/Terrains.js';
import TileImprovement from '../../core-tile-improvements/TileImprovement.js';

export class Pollution extends TileImprovement {
  // TODO: control via RulesRegistry
  cost = 0;

  // TODO: control via RulesRegistry
  static available = [
    Arctic,
    Desert,
    Forest,
    Grassland,
    Hills,
    Jungle,
    Mountains,
    Plains,
    River,
    Swamp,
    Tundra,
  ];
}

export default Pollution;
