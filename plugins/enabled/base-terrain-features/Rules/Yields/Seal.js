import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../../base-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Seal} from '../../TerrainFeatures.js';

RulesRegistry.register(new Rule(
  'tile:yield:food:seal',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Seal)),
  new Effect((tileYield) => tileYield.add(2))
));
