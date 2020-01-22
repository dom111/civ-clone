import {Food, Production} from '../../Yields.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Plains} from '../../../base-terrain/Terrains.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:food:plains',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Plains),
  new Effect((tileYield) => tileYield.add(1))
));
Rules.register(new Rule(
  'tile:yield:production:plains',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain instanceof Plains),
  new Effect((tileYield) => tileYield.add(2))
));
