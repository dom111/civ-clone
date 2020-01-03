import {Desert, Grassland, Hills, Plains, River} from '../base-terrain/Terrains.js';
import Improvement from './Improvement.js';

export class Irrigation extends Improvement {
  name = 'irrigation';
  title = 'Irrigation';
  cost = 1;
  available = [
    Desert,
    Grassland,
    Hills,
    Plains,
    River
  ];
}

Improvement.register(Irrigation);