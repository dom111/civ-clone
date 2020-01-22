import {Food, Production} from '../../../Yields.js';
import {Cow} from '../../../../base-terrain/Terrains.js';
import Criterion from '../../../../core-rules/Criterion.js';
import Effect from '../../../../core-rules/Effect.js';
import Rule from '../../../../core-rules/Rule.js';
import Rules from '../../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:food:grassland:cow',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Cow),
  new Effect((tileYield) => tileYield.add(1))
));
Rules.register(new Rule(
  'tile:yield:production:grassland:cow',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain instanceof Cow),
  new Effect((tileYield) => tileYield.add(1))
));
