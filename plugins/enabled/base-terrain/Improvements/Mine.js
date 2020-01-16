import {Desert, Hills, Mountains} from '../Terrains.js';
import Improvement from '../Improvement.js';

export class Mine extends Improvement {
  name = 'mine';
  title = 'Mine';
  cost = 3;
  static available = [
    Desert,
    Hills,
    Mountains,
  ];
}

Improvement.register(Mine);