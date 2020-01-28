import {Desert, Hills, Mountains} from '../../base-terrain/Terrains.js';
import Improvement from '../../core-terrain-improvements/Improvement.js';

export class Mine extends Improvement {
  // TODO: control via Rules
  cost = 3;

  // TODO: control via Rules
  static available = [
    Desert,
    Hills,
    Mountains,
  ];
}

export default Mine;

Improvement.register(Mine);