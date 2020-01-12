import {Arctic, Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, River, Swamp, Tundra} from '../base-terrain/Terrains.js';
import Improvement from './Improvement.js';

export class Railroad extends Improvement {
  name = 'railroad';
  title = 'Railroad';
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

Improvement.register(Railroad);