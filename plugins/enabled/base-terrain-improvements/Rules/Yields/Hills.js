import {Food, Production} from '../../../base-yields/Yields.js';
import {Irrigation, Mine} from '../../Improvements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Hills} from '../../../base-terrain/Terrains.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:food:hills:irrigation',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Hills),
  new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Irrigation)),
  new Effect((tileYield) => tileYield.add(1))
));
Rules.register(new Rule(
  'tile:yield:production:hills:mine',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain instanceof Hills),
  new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Mine)),
  new Effect((tileYield) => tileYield.add(2))
));
