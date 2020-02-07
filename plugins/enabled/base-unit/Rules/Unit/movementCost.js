import {LandUnit, NavalTransport} from '../../Types.js';
import {Railroad, Road} from '../../../base-terrain-improvements/Improvements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

// movement cost
RulesRegistry.register(new Rule('unit:movementCost:default', new Effect((unit, to) => to.terrain.movementCost)));
RulesRegistry.register(new Rule(
  'unit:movementCost:withRoad',
  new Criterion((unit, to, from) => (from || unit.tile).improvements.some((improvement) => improvement instanceof Road)),
  new Criterion((unit, to) => to.improvements.some((improvement) => improvement instanceof Road)),
  new Effect(() => 1 / 3)
));
RulesRegistry.register(new Rule(
  'unit:movementCost:withRailroad',
  new Criterion((unit, to, from) => (from || unit.tile).improvements.some((improvement) => improvement instanceof Railroad)),
  new Criterion((unit, to) => to.improvements.some((improvement) => improvement instanceof Railroad)),
  // TODO: need to also protect against goto etc, like classic Civ does, although I'd rather that was done by evaluating
  //  the moves and if a loop is detected auto-cancelling - this is pretty primitive.
  // new Criterion((unit) => ! (unit.player instanceof AIPlayer)),
  new Effect(() => 0)
));
RulesRegistry.register(new Rule(
  'unit:movementCost:beingTransported',
  new Criterion((unit) => unit instanceof LandUnit),
  new Criterion((unit) => unit.transport instanceof NavalTransport),
  new Effect(() => 0)
));
