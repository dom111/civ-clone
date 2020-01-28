import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Horse} from '../../TerrainFeatures.js';
import {Production} from '../../../base-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:production:horse',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Horse)),
  new Effect((tileYield) => tileYield.add(1))
));
