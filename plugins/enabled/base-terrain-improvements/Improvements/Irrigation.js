import {Desert, Grassland, Hills, Plains} from '../../base-terrain/Terrains.js';
import Improvement from '../../core-terrain-improvements/Improvement.js';

export class Irrigation extends Improvement {
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
