import {Food, Production} from '../../Yields.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Forest} from '../../../base-terrain/Terrains.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'tile:yield:food:forest',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Forest),
  new Effect((tileYield) => tileYield.add(1))
));
RulesRegistry.register(new Rule(
  'tile:yield:production:forest',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain instanceof Forest),
  new Effect((tileYield) => tileYield.add(2))
));
