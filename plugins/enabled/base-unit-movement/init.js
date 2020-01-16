import {Land, Ocean} from '../base-terrain/Terrains.js';
import {LandUnit, NavalUnit} from '../base-unit/Units.js';
import {Railroad, Road} from '../base-terrain-improvements/Improvements.js';
// import AIPlayer from '../core-player/AIPlayer.js';
import Criterion from '../core-rules/Criterion.js';
import Effect from '../core-rules/Effect.js';
import OneCriteria from '../core-rules/OneCriteria.js';
import Rule from '../core-rules/Rule.js';
import Rules from '../core-rules/Rules.js';
import Tile from '../core-world/Tile.js';

Rules.register(new Rule('unit:movement:validToTile', new Criterion((unit, to) => to instanceof Tile)));
Rules.register(new Rule('unit:movement:isNeighbouringTile', new Criterion(
  (unit, to) => Object.values(unit.tile.neighbours)
    .includes(to)
)
));
Rules.register(new Rule(
  'unit:movement:validateUnitType',
  new OneCriteria(
    (unit, to) => unit instanceof LandUnit && (
      // TODO: naval transport
      to.terrain instanceof Land/* ||
      (
        to.terrain instanceof Ocean &&
        to.terrain.units.some((navalUnit) => unit.player === navalUnit.player && navalUnit.hasCapacity())
      )*/
    ),
    (unit, to) => unit instanceof NavalUnit && (
      to.terrain instanceof Ocean || (to.city && to.city.player === unit.player)
    ),
    (unit) => unit.air
  )));
Rules.register(new Rule(
  'unit:movement:hasEnoughMovesLeft',
  new Criterion((unit) => unit.movesLeft >= .1)
));

// This is analogous to the original Civilization unit adjacency rules
Rules.register(new Rule(
  'unit:movement:unitAdjacencyRules',
  new Criterion((unit, to) => ! Object.values(unit.tile.neighbours)
    .filter(
      (tile) => tile.units.length > 0 &&
        tile.units[0].player !== unit.player
    )
    .flatMap((tile) => Object.values(tile.neighbours))
    .includes(to)
  )
));

// movement cost
Rules.register(new Rule('unit:movementCost:default', new Effect((unit, to) => to.terrain.movementCost)));
Rules.register(new Rule(
  'unit:movementCost:withRoad',
  new Criterion((unit) => unit.tile.improvements.some((improvement) => improvement instanceof Road)),
  new Criterion((unit, to) => to.improvements.some((improvement) => improvement instanceof Road)),
  new Effect(() => 1 / 3)
));
Rules.register(new Rule(
  'unit:movementCost:withRailroad',
  new Criterion((unit) => unit.tile.improvements.some((improvement) => improvement instanceof Railroad)),
  new Criterion((unit, to) => to.improvements.some((improvement) => improvement instanceof Railroad)),
  // TODO: need to also protect against goto etc, like classic Civ does, although I'd rather that was done by evaluating
  //  the moves and if a loop is detected auto-cancelling - this is pretty primitive.
  // new Criterion((unit) => ! (unit.player instanceof AIPlayer)),
  new Effect(() => 0)
));
