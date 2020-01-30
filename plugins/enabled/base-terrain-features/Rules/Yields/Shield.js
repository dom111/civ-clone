import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Production} from '../../../base-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import {Shield} from '../../TerrainFeatures.js';

RulesRegistry.register(new Rule(
  'tile:yield:production:coal',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain.features.some((feature) => feature instanceof Shield)),
  new Effect((tileYield) => tileYield.add(1))
));
