import {Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, River, Swamp, Tundra} from '../../../base-terrain/Terrains.js';
import {Irrigation, Mine, Road} from '../../TileImprovements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [Irrigation, Desert, Grassland, Hills, Plains, River],
  [Mine, Desert, Hills, Mountains],
  [Road, Desert, Forest, Grassland, Hills, Jungle, Mountains, Plains, Swamp, Tundra],
]
  .forEach(([Improvement, ...Terrains]) => RulesRegistry.register(new Rule(
    `tile:improvement:available:${Improvement.name.toLowerCase()}`,
    new Criterion((tile, TileImprovement) => TileImprovement === Improvement),
    new Effect((tile) => Terrains.some((Terrain) => tile.terrain instanceof Terrain))
  )))
;
