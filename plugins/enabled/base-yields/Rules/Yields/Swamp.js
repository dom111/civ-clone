import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Swamp} from '../../../base-terrain/Terrains.js';

RulesRegistry.register(new Rule(
  'tile:yield:food:swamp',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Swamp),
  new Effect((tileYield) => tileYield.add(1))
));
