import Criterion from '../../../../core-rules/Criterion.js';
import Effect from '../../../../core-rules/Effect.js';
import {Food} from '../../../Yields.js';
import {Horse} from '../../../../base-terrain/Terrains.js';
import Rule from '../../../../core-rules/Rule.js';
import Rules from '../../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:production:forest:horse',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Horse),
  new Effect((tileYield) => tileYield.add(1))
));
