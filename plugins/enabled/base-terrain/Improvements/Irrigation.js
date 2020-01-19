import {Desert, Grassland, Hills, Plains, River} from '../Terrains.js';
import Improvement from '../Improvement.js';

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