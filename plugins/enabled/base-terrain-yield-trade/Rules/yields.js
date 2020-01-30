import {Desert, Grassland, Ocean, Plains, River} from '../../base-terrain/Terrains.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import {Road} from '../../base-terrain-improvements/Improvements.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import {Trade} from '../Yields.js';

[
  Desert,
  Grassland,
  Plains,
]
  .forEach((Terrain) => {
    RulesRegistry.register(new Rule(
      `tile:yield:trade:${Terrain.name.toLowerCase()}:road`,
      new Criterion((tileYield) => tileYield instanceof Trade),
      new Criterion((tileYield, tile) => tile.terrain instanceof Terrain),
      new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Road)),
      new Effect((tileYield) => tileYield.add(1))
    ));
  })
;
RulesRegistry.register(new Rule(
  'tile:yield:trade:ocean',
  new Criterion((tileYield) => tileYield instanceof Trade),
  new Criterion((tileYield, tile) => tile.terrain instanceof Ocean),
  new Effect((tileYield) => tileYield.add(2))
));
RulesRegistry.register(new Rule(
  'tile:yield:trade:river',
  new Criterion((tileYield) => tileYield instanceof Trade),
  new Criterion((tileYield, tile) => tile.terrain instanceof River),
  new Effect((tileYield) => tileYield.add(1))
));
