import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Plains,
  Swamp,
  Tundra,
} from '../../base-terrain/Terrains.js';
import Improvement from '../../core-terrain-improvements/Improvement.js';

export class Road extends Improvement {
  // TODO: control via RulesRegistry
  cost = 1;

  // TODO: control via RulesRegistry
  static available = [
    Arctic,
    Desert,
    Forest,
    Grassland,
    Hills,
    Jungle,
    Mountains,
    Plains,
    Swamp,
    Tundra,
  ];
}

export default Road;
