import {Arctic, Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, River, Swamp, Tundra} from '../../base-terrain/Terrains.js';
import Improvement from '../../core-terrain-improvements/Improvement.js';

export class Pollution extends Improvement {
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
