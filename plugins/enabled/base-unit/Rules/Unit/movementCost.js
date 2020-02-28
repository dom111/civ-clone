import {
  Arctic,
  Desert,
  Forest,
  Grassland,
  Hills,
  Jungle,
  Mountains,
  Ocean,
  Plains,
  River,
  Swamp,
  Tundra,
} from '../../../base-terrain/Terrains.js';
import {LandUnit, NavalTransport} from '../../Types.js';
import {Railroad, Road} from '../../../base-tile-improvements/TileImprovements.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';

[
  [Arctic, 2],
  [Desert, 1],
  [Forest, 2],
  [Grassland, 1],
  [Hills, 2],
  [Jungle, 2],
  [Mountains, 3],
  [Ocean, 1],
  [Plains, 1],
  [River, 1],
  [Swamp, 2],
  [Tundra, 1],
]
  .forEach(([Terrain, cost]) => RulesRegistry.register(new Rule(
    `unit:movementCost:${[Terrain.name.toLowerCase()]}`,
    new Criterion((unit, to) => to.terrain instanceof Terrain),
    new Effect(() => cost)
  )))
;

RulesRegistry.register(new Rule(
  'unit:movementCost:withRoad',
  new Criterion((unit, to, from) => TileImprovementRegistry.getBy('tile', from || unit.tile)
    .some((improvement) => improvement instanceof Road)
  ),
  new Criterion((unit, to) => TileImprovementRegistry.getBy('tile', to)
    .some((improvement) => improvement instanceof Road)
  ),
  new Effect(() => 1 / 3)
));

RulesRegistry.register(new Rule(
  'unit:movementCost:withRailroad',
  new Criterion((unit, to, from) => TileImprovementRegistry.getBy('tile', from || unit.tile)
    .some((improvement) => improvement instanceof Railroad)
  ),
  new Criterion((unit, to) => TileImprovementRegistry.getBy('tile', to)
    .some((improvement) => improvement instanceof Railroad)
  ),
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
