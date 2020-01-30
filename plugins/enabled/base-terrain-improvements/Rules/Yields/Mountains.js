import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Mine} from '../../Improvements.js';
import {Mountains} from '../../../base-terrain/Terrains.js';
import {Production} from '../../../base-yields/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'tile:yield:production:mountains:mine',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain instanceof Mountains),
  new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Mine)),
  new Effect((tileYield) => tileYield.add(1))
));
