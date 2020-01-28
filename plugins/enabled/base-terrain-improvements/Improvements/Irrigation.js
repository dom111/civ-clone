import {Desert, Grassland, Hills, Plains} from '../../base-terrain/Terrains.js';
import Improvement from '../../core-terrain-improvements/Improvement.js';

export class Irrigation extends Improvement {
  // TODO: control via Rules
  cost = 1;

  // TODO: control via Rules
  static available = [
    Desert,
    Grassland,
    Hills,
    Plains,
  ];
}

export default Irrigation;

Improvement.register(Irrigation);