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
} from '../base-terrain/Terrains.js';
import {
  Coal,
  Fish,
  Game,
  Gems,
  Gold,
  Horse,
  Oasis,
  Oil,
  Seal,
  Shield,
} from '../base-terrain-features/TerrainFeatures.js';

import Generator from '../core-world-generator/Generator.js';

export class StaticWorldGenerator extends Generator {
  constructor() {
    super({
      height: 1,
      width: 24,
    });
  }

  generate() {
    return [
      [Arctic],
      [Arctic, Seal],
      [Desert],
      [Desert, Oasis],
      [Forest],
      [Forest, Horse],
      [Grassland],
      [Grassland, Shield],
      [Hills],
      [Hills, Coal],
      [Jungle],
      [Jungle, Gems],
      [Mountains],
      [Mountains, Gold],
      [Ocean],
      [Ocean, Fish],
      [Plains],
      [Plains, Game],
      [River],
      [River, Shield],
      [Swamp],
      [Swamp, Oil],
      [Tundra],
      [Tundra, Game],
    ]
      .map(([Terrain, Feature]) => this.getTerrainWithFeature(Terrain, Feature))
    ;
  }

  getTerrainWithFeature(Terrain, Feature) {
    const terrain = new Terrain();

    if (Feature) {
      terrain.features().push(new Feature());
    }

    return terrain;
  }
}

export default StaticWorldGenerator;
