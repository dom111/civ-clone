import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Gems} from '../../TerrainFeatures.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';
import {Trade} from '../../../base-yield-trade/Yields/Trade.js';

Rules.register(new Rule(
  'tile:yield:trade:gems',
  new Criterion((tileYield) => tileYield instanceof Trade),
  new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Gems)),
  new Effect((tileYield) => tileYield.add(2))
));
