import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../Yields.js';
import {Jungle} from '../../../base-terrain/Terrains.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'tile:yield:food:jungle',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Jungle),
  new Effect((tileYield) => tileYield.add(1))
));
