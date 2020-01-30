import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Grassland} from '../../../base-terrain/Terrains.js';
import {Road} from '../../../base-terrain-improvements/Improvements.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Trade} from '../../Yields/Trade.js';

RulesRegistry.register(new Rule(
  'tile:yield:trade:grassland:road',
  new Criterion((tileYield) => tileYield instanceof Trade),
  new Criterion((tileYield, tile) => tile.terrain instanceof Grassland),
  new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Road)),
  new Effect((tileYield) => tileYield.add(1))
));
