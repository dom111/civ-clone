import {Arctic, Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, River, Swamp, Tundra} from '../Terrains.js';
import Improvement from '../Improvement.js';

export class Pollution extends Improvement {
  cost = 0;
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

Improvement.register(Pollution);