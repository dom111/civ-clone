import Criterion from '../../../core-rules/Criterion.js';
import {Desert} from '../../../base-terrain/Terrains.js';
import Effect from '../../../core-rules/Effect.js';
import {Road} from '../../../base-terrain-improvements/Improvements.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';
import {Trade} from '../../Yields/Trade.js';

Rules.register(new Rule(
  'tile:yield:trade:desert:road',
  new Criterion((tileYield) => tileYield instanceof Trade),
  new Criterion((tileYield, tile) => tile.terrain instanceof Desert),
  new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Road)),
  new Effect((tileYield) => tileYield.add(1))
));
