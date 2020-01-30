import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Gold} from '../../TerrainFeatures.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields/Trade.js';

RulesRegistry.register(new Rule(
  'tile:yield:trade:gold',
  new Criterion((tileYield) => tileYield instanceof Trade),
  new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Gold)),
  new Effect((tileYield) => tileYield.add(3))
));
