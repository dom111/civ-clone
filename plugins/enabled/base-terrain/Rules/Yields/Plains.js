import {Plains} from '../../Terrains.js';
import {Food, Production} from '../../Yields.js';
import {Irrigation} from '../../Improvements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:food:plains',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Plains),
  new Effect((tileYield) => tileYield.add(1))
));
Rules.register(new Rule(
  'tile:yield:food:plains',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Plains),
  new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Irrigation)),
  new Effect((tileYield) => tileYield.add(1))
));
Rules.register(new Rule(
  'tile:yield:production:plains',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain instanceof Plains),
  new Effect((tileYield) => tileYield.add(2))
));
