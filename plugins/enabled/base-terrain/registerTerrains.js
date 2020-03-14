import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  River,
  Swamp,
  Tundra,
} from './Terrains.js';
import TerrainRegistry from '../core-terrain/TerrainRegistry.js';

[
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  River,
  Swamp,
  Tundra,
]
  .forEach((Terrain) => TerrainRegistry.getInstance()
    .register(Terrain)
  )
;
