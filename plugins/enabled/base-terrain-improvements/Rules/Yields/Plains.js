import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../../base-yields/Yields.js';
import {Irrigation} from '../../Improvements.js';
import {Plains} from '../../../base-terrain/Terrains.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'tile:yield:food:plains:irrigation',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Plains),
  new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Irrigation)),
  new Effect((tileYield) => tileYield.add(1))
));
