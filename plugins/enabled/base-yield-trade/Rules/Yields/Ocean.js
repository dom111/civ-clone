import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Ocean} from '../../../base-terrain/Terrains.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';
import {Trade} from '../../Yields/Trade.js';

Rules.register(new Rule(
  'tile:yield:trade:ocean',
  new Criterion((tileYield) => tileYield instanceof Trade),
  new Criterion((tileYield, tile) => tile.terrain instanceof Ocean),
  new Effect((tileYield) => tileYield.add(2))
));
