import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Food} from '../../Yields.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';
import {Tundra} from '../../../base-terrain/Terrains.js';

Rules.register(new Rule(
  'tile:yield:food:tundra',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Tundra),
  new Effect((tileYield) => tileYield.add(1))
));
