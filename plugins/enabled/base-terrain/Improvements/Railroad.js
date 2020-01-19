import {Arctic, Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, River, Swamp, Tundra} from '../Terrains.js';
import Improvement from '../Improvement.js';

export class Railroad extends Improvement {
  cost = 1;
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

export default Railroad;

Improvement.register(Railroad);