import Criterion from '../../../core-rules/Criterion.js';
import {Desert} from '../../../base-terrain/Terrains.js';
import Effect from '../../../core-rules/Effect.js';
import {Production} from '../../Yields.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'tile:yield:production:desert',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain instanceof Desert),
  new Effect((tileYield) => tileYield.add(1))
));
