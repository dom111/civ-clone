import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Fish} from '../../TerrainFeatures.js';
import {Food} from '../../../base-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:food:fish',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Fish)),
  new Effect((tileYield) => tileYield.add(1))
));
