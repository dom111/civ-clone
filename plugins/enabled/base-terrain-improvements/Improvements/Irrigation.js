import {Desert, Grassland, Hills, Plains, River} from '../../base-terrain/Terrains.js';
import Improvement from '../../core-terrain-improvements/Improvement.js';

export class Irrigation extends Improvement {
  cost = 1;
  static available = [
    Desert,
    Grassland,
    Hills,
    Plains,
    River,
  ];
}

export default Irrigation;

Improvement.register(Irrigation);