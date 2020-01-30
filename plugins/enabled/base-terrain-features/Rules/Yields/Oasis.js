import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../../base-yields/Yields.js';
import {Oasis} from '../../TerrainFeatures.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'tile:yield:food:oasis',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Oasis)),
  new Effect((tileYield) => tileYield.add(2))
));
