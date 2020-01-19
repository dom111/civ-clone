import {Mountains} from '../../Terrains.js';
import {Production} from '../../Yields.js';
import {Mine} from '../../Improvements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:production:mountains',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain instanceof Mountains),
  new Effect((tileYield) => tileYield.add(1))
));
Rules.register(new Rule(
  'tile:yield:production:mountains:mine',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain instanceof Mountains),
  new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Mine)),
  new Effect((tileYield) => tileYield.add(1))
));
