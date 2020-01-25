import {Land, Water} from '../../core-terrain/Types.js';
import {LandUnit, NavalTransport, NavalUnit} from '../Units.js';
import {Railroad, Road} from '../../base-terrain-improvements/Improvements.js';
// import AIPlayer from '../core-player/AIPlayer.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import OneCriteria from '../../core-rules/OneCriteria.js';
import Rule from '../../core-rules/Rule.js';
import Rules from '../../core-rules/Rules.js';
import Tile from '../../core-world/Tile.js';

Rules.register(new Rule('unit:movement:validToTile', new Criterion((unit, to) => to instanceof Tile)));
Rules.register(new Rule('unit:movement:isNeighbouringTile', new OneCriteria(
  new Criterion(
    (unit, to, from) => to.isNeighbourOf(from || unit.tile)
  ),
  // This rule doesn't need to be met if we're being transported.
  new Criterion(
    (unit, to) => to.units.includes(unit.transport)
  )
)));
Rules.register(new Rule(
  'unit:movement:validateUnitType',
  new OneCriteria(
    (unit, to) => unit instanceof LandUnit && (
      to.terrain instanceof Land ||
      (
        to.terrain instanceof Water &&
        (
          to.units.some((navalUnit) => (
            unit.player === navalUnit.player &&
            navalUnit instanceof NavalTransport &&
            (
              navalUnit.hasCapacity() ||
              navalUnit === unit.transport
            )
          ))
        )
      )
    ),
    (unit, to) => unit instanceof NavalUnit && (
      to.terrain instanceof Water || (to.city && to.city.player === unit.player)
    ),
    (unit) => unit.air
  )
));
Rules.register(new Rule(
  'unit:movement:hasEnoughMovesLeft',
  new OneCriteria(
    new Criterion((unit) => unit.movesLeft >= .1),

    // This rule doesn't need to be met if we're being transported.
    new Criterion(
      (unit, to) => to.units.includes(unit.transport)
    )
  )
));

// This is analogous to the original Civilization unit adjacency rules
Rules.register(new Rule(
  'unit:movement:unitAdjacencyRules',
  new Criterion((unit, to, from) => ! (from || unit.tile).getNeighbours()
    .filter(
      (tile) => tile.units.length > 0 &&
        tile.units[0].player !== unit.player
    )
    .flatMap((tile) => tile.getNeighbours())
    .includes(to)
  )
));

// movement cost
Rules.register(new Rule('unit:movementCost:default', new Effect((unit, to) => to.terrain.movementCost)));
Rules.register(new Rule(
  'unit:movementCost:withRoad',
  new Criterion((unit, to, from) => (from || unit.tile).improvements.some((improvement) => improvement instanceof Road)),
  new Criterion((unit, to) => to.improvements.some((improvement) => improvement instanceof Road)),
  new Effect(() => 1 / 3)
));
Rules.register(new Rule(
  'unit:movementCost:withRailroad',
  new Criterion((unit, to, from) => (from || unit.tile).improvements.some((improvement) => improvement instanceof Railroad)),
  new Criterion((unit, to) => to.improvements.some((improvement) => improvement instanceof Railroad)),
  // TODO: need to also protect against goto etc, like classic Civ does, although I'd rather that was done by evaluating
  //  the moves and if a loop is detected auto-cancelling - this is pretty primitive.
  // new Criterion((unit) => ! (unit.player instanceof AIPlayer)),
  new Effect(() => 0)
));
Rules.register(new Rule(
  'unit:movementCost:beingTransported',
  new Criterion((unit) => unit instanceof LandUnit),
  new Criterion((unit) => unit.transport instanceof NavalTransport),
  new Effect(() => 0)
));
