import FillGenerator from '../../../base-world-generator/FillGenerator.js';
import {Grassland} from '../../../base-terrain/Terrains.js';
import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';
import World from '../../../core-world/World.js';

export const generateFixedWorld = ({
  Terrain = Grassland,
  height = 5,
  rulesRegistry = RulesRegistry.getInstance(),
  width = 5,
} = {}) => {
  const generator = new FillGenerator({
      Terrain,
      height,
      width,
    }),

    world = new World(generator)
  ;

  world.build({
    rulesRegistry,
  });

  return world;
};

export default generateFixedWorld;
