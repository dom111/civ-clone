import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Oil} from '../../TerrainFeatures.js';
import {Production} from '../../../base-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:production:oil',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Oil)),
  new Effect((tileYield) => tileYield.add(3))
));
