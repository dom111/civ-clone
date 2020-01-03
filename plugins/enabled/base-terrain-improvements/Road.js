import {Arctic, Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, River, Swamp, Tundra} from '../base-terrain/Terrains.js';
import Improvement from './Improvement.js';

export class Road extends Improvement {
  name = 'road';
  title = 'Road';
  cost = 1;
  available = [
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
    Tundra
  ];
}

Improvement.register(Road);