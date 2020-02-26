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
import TileImprovement from '../../core-tile-improvements/TileImprovement.js';

export class Road extends TileImprovement {
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
