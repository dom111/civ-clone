import {Irrigation, Road} from '../../../base-tile-improvements/TileImprovements.js';
import City from '../../../core-city/City.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import FillGenerator from '../../../base-world-generator/FillGenerator.js';
import {Grassland} from '../../../base-terrain/Terrains.js';
import Player from '../../../core-player/Player.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Shield} from '../../../base-terrain-features/TerrainFeatures.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';
import Tileset from '../../../core-world/Tileset.js';
import {Water} from '../../../core-terrain/Types.js';
import World from '../../../core-world/World.js';

export const setUpCity = ({
  size = 1,
  tile,
  world,
  rulesRegistry = RulesRegistry.getInstance(),
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
  tileImprovementRegistry = TileImprovementRegistry.getInstance(),
} = {}) => {
  if (! world) {
    const generator = new FillGenerator({
      height: 5,
      width: 5,
    });

    world = new World(generator);

    world.build({
      rulesRegistry,
    });

    Tileset.fromSurrounding(world.get(2, 2))
      .forEach((tile) => {
        tile.terrain = new Grassland();
        tile.terrain.features().push(new Shield());
      })
    ;
  }

  const player = new Player(),
    city = new City({
      player,
      rulesRegistry,
      tile: tile || world.get(2, 2),
    })
  ;

  cityImprovementRegistry.getBy('city', city)
    .forEach((improvement) => cityImprovementRegistry.unregister(improvement))
  ;

  Tileset.fromSurrounding(city.tile())
    .forEach((tile) => {
      if (tile.terrain instanceof Water) {
        return;
      }

      [
        new Irrigation(tile),
        new Road(tile),
      ]
        .forEach((improvement) => tileImprovementRegistry.register(improvement))
      ;

      player.seenTiles().push(tile);
    })
  ;

  while (city.size() < size) {
    city.grow();
  }

  city.autoAssignWorkers();

  return city;
};

export default setUpCity;
