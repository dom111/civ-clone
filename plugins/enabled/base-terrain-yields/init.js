import {Irrigation, Mine, Railroad} from '../base-terrain-improvements/Improvements.js';
import Criterion from '../core-rules/Criterion.js';
import Effect from '../core-rules/Effect.js';
import Rule from '../core-rules/Rule.js';

Rule.register(new Rule('tile:food:default', new Effect((tile) => tile.food)));
Rule.register(new Rule(
  'tile:food:withRailroad',
  new Criterion((tile) => tile.improvements.some((improvement) => improvement instanceof Railroad)),
  new Effect((tile) => Math.floor(tile.food - 1.5))
));
Rule.register(new Rule(
  'tile:food:withIrrigation',
  new Criterion((tile) => tile.improvements.some((improvement) => improvement instanceof Irrigation)),
  new Effect((tile) => tile.food + 1)
));
Rule.register(new Rule(
  'tile:food:withIrrigationAndRailroad',
  new Criterion((tile) => tile.improvements.some((improvement) => improvement instanceof Irrigation)),
  new Criterion((tile) => tile.improvements.some((improvement) => improvement instanceof Railroad)),
  new Effect((tile) => Math.floor((tile.food + 1) * 1.5))
));

Rule.register(new Rule('tile:production:default', new Effect((tile) => tile.production)));
Rule.register(new Rule(
  'tile:production:withRailroad',
  new Criterion((tile) => tile.improvements.some((improvement) => improvement instanceof Railroad)),
  new Effect((tile) => Math.floor(tile.production * 1.5))
));
Rule.register(new Rule(
  'tile:production:withMine',
  new Criterion((tile) => tile.improvements.some((improvement) => improvement instanceof Mine)),
  new Effect((tile) => Math.floor(tile.production + 2))
));
Rule.register(new Rule(
  'tile:production:withMineAndRailroad',
  new Criterion((tile) => tile.improvements.some((improvement) => improvement instanceof Irrigation)),
  new Criterion((tile) => tile.improvements.some((improvement) => improvement instanceof Railroad)),
  new Effect((tile) => Math.floor((tile.production + 2) * 1.5))
));
