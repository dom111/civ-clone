import {Desert, Hills, Mountains} from '../../base-terrain/Terrains.js';
import Improvement from '../../core-terrain-improvements/Improvement.js';

export class Mine extends Improvement {
  // TODO: control via RulesRegistry
  cost = 3;

  // TODO: control via RulesRegistry
  static available = [
    Desert,
    Hills,
    Mountains,
  ];
}

export default Mine;
