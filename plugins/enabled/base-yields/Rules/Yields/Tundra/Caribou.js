import {Caribou} from '../../../../base-terrain/Terrains.js';
import Criterion from '../../../../core-rules/Criterion.js';
import Effect from '../../../../core-rules/Effect.js';
import {Food} from '../../../Yields.js';
import Rule from '../../../../core-rules/Rule.js';
import Rules from '../../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:food:tundra:caribou',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Caribou),
  new Effect((tileYield) => tileYield.add(1))
));
