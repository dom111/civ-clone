import {Desert, Hills, Mountains} from '../Terrains.js';
import Improvement from '../Improvement.js';

export class Mine extends Improvement {
  cost = 3;
  static available = [
    Desert,
    Hills,
    Mountains,
  ];
}

export default Mine;

Improvement.register(Mine);