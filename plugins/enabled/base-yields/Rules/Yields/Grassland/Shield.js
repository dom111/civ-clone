import Criterion from '../../../../core-rules/Criterion.js';
import Effect from '../../../../core-rules/Effect.js';
import {Production} from '../../../Yields.js';
import Rule from '../../../../core-rules/Rule.js';
import Rules from '../../../../core-rules/Rules.js';
import {Shield} from '../../../../base-terrain/Terrains.js';

Rules.register(new Rule(
  'tile:yield:production:grassland:shield',
  new Criterion((tileYield) => tileYield instanceof Production),
  new Criterion((tileYield, tile) => tile.terrain instanceof Shield),
  new Effect((tileYield) => tileYield.add(1))
));
