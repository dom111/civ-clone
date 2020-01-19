import {Food} from '../../Yields.js';
import {Grassland} from '../../Terrains.js';
// import {Irrigation} from '../../Improvements/Irrigation.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Rules from '../../../core-rules/Rules.js';

Rules.register(new Rule(
  'tile:yield:food:grassland',
  new Criterion((tileYield) => tileYield instanceof Food),
  new Criterion((tileYield, tile) => tile.terrain instanceof Grassland),
  new Effect((tileYield) => tileYield.add(2))
));
// TODO: this is only in effect for non-despotism governments - need to align rules to government types/civics
// Rules.register(new Rule(
//   'tile:yield:production:grassland:irrigation',
//   new Criterion((tileYield) => tileYield instanceof Food),
//   new Criterion((tileYield, tile) => tile.terrain instanceof Grassland),
//   new Criterion((tileYield, tile) => tile.improvements.some((improvement) => improvement instanceof Irrigation)),
//   new Effect((tileYield) => tileYield.add(1))
// ));
