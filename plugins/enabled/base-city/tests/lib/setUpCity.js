import {Arctic, Desert, Grassland, Hills, Mountains, Ocean, Plains, River} from '../../../base-terrain/Terrains.js';
import {Irrigation, Mine, Road} from '../../../base-tile-improvements/TileImprovements.js';
import City from '../../../core-city/City.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import FillGenerator from '../../../base-world-generator/FillGenerator.js';
import Player from '../../../core-player/Player.js';
import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';
import {Shield} from '../../../base-terrain-features/TerrainFeatures.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';
import Tileset from '../../../core-world/Tileset.js';
import {Water} from '../../../core-terrain/Types.js';
import World from '../../../core-world/World.js';

export const setUpCity = ({
  size = 1,
  rulesRegistry = RulesRegistry.getInstance(),
  world = (() => {
    const generator = new FillGenerator({
      Terrain: Grassland,
      height: 5,
      width: 5,
    });

    const world = new World(generator);

    world.build({
      rulesRegistry,
    });

    world.entries()
      .forEach((tile) => tile.terrain().features().push(new Shield()))
    ;

    return world;
  })(),
  tile = world.get(2, 2),
  player = new Player({
    rulesRegistry,
  }),
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
  tileImprovementRegistry = TileImprovementRegistry.getInstance(),
} = {}) => {
  const city = new City({
    player,
    rulesRegistry,
    tile,
  });

  cityImprovementRegistry.getBy('city', city)
    .forEach((improvement) => cityImprovementRegistry.unregister(improvement))
  ;

  Tileset.fromSurrounding(city.tile())
    .forEach((tile) => {
      if (tile.terrain() instanceof Water) {
        return;
      }

      if ([Desert, Grassland, Hills, Plains, River].some((Terrain) => tile.terrain() instanceof Terrain)) {
        tileImprovementRegistry.register(new Irrigation(tile));
      }
      else if ([Hills, Mountains].some((Terrain) => tile.terrain() instanceof Terrain)) {
        tileImprovementRegistry.register(new Mine(tile));
      }

      if (! [Arctic, Ocean, River].some((Terrain) => tile.terrain() instanceof Terrain)) {
        tileImprovementRegistry.register(new Road(tile));
      }

      player.seenTiles()
        .push(tile)
      ;
    })
  ;

  while (city.size() < size) {
    city.grow();
  }

  city.autoAssignWorkers();

  return city;
};

export default setUpCity;
