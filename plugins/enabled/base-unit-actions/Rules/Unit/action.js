import '../../../base-tile-improvements/Rules/Tile/improvement.js';
import {
  Attack,
  BuildIrrigation,
  BuildMine,
  BuildRoad,
  CaptureCity,
  ClearForest,
  ClearJungle,
  ClearSwamp,
  Disembark,
  Embark,
  Fortify,
  FoundCity,
  Move,
  NoOrders,
  PlantForest,
  Unload,
} from '../../Actions.js';
import {Forest, Jungle, Plains, River, Swamp} from '../../../base-terrain/Terrains.js';
import {FortifiableUnit, LandUnit, NavalTransport, NavalUnit} from '../../../base-unit/Types.js';
import {Irrigation, Mine, Road} from '../../../base-tile-improvements/TileImprovements.js';
import {Land, Water} from '../../../core-terrain/Types.js';
import {Settlers, Worker} from '../../../base-unit/Units.js';
import CityRegistry from '../../../core-city/CityRegistry.js';
import Criteria from '../../../core-rules/Criteria.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import OneCriteria from '../../../core-rules/OneCriteria.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import TileImprovementRegistry from '../../../core-tile-improvements/TileImprovementRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

const isNeighbouringTile = new Criterion((unit, to, from = unit.tile) => to.isNeighbourOf(from)),
  hasEnoughMovesLeft = new Criterion((unit) => unit.moves.value() >= .1)
;

RulesRegistry.register(new Rule(
  'unit:action:move',
  isNeighbouringTile,
  hasEnoughMovesLeft,
  new OneCriteria(
    new Criteria(
      new Criterion((unit) => unit instanceof LandUnit),
      new Criterion((unit, to) => to.terrain instanceof Land),
      new Criterion((unit, to) => UnitRegistry.getBy('tile', to)
        .every((tileUnit) => tileUnit.player === unit.player)
      )
    ),
    new Criteria(
      new Criterion((unit) => unit instanceof NavalUnit),
      new OneCriteria(
        new Criterion((unit, to) => to.terrain instanceof Water),
        new Criterion((unit, to) => CityRegistry.getBy('tile', to)
          .some((city) => city.player === unit.player)
        )
      )
    )
  ),

  // This is analogous to the original Civilization unit adjacency rules
  new OneCriteria(
    new Criterion((unit) => ! (unit instanceof LandUnit)),
    new Criterion((unit, to, from = unit.tile) => ! (
      from.getNeighbours()
        .some((tile) => UnitRegistry.getBy('tile', tile)
          .some((tileUnit) => tileUnit.player !== unit.player)
        ) &&
        to.getNeighbours()
          .some((tile) => UnitRegistry.getBy('tile', tile)
            .some((tileUnit) => tileUnit.player !== unit.player)
          )
    )
    )
  ),
  new Criterion((unit, to) => UnitRegistry.getBy('tile', to)
    .every((tileUnit) => tileUnit.player === unit.player)
  ),
  new Effect((unit, to, from = unit.tile) => new Move(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:attack',
  isNeighbouringTile,
  hasEnoughMovesLeft,
  new OneCriteria(
    new Criteria(
      new Criterion((unit) => unit instanceof LandUnit),
      new Criterion((unit, to) => to.terrain instanceof Land)
    ),
    new Criteria(
      new Criterion((unit) => unit instanceof NavalUnit),
      new OneCriteria(
        new Criterion((unit, to) => to.terrain instanceof Water),
        new Criteria(
          new Criterion((unit, to) => UnitRegistry.getBy('tile', to)
            .some((tileUnit) => tileUnit.player !== unit.player)
          )
        )
      )
    )
  ),
  new Criterion((unit, to) => UnitRegistry.getBy('tile', to)
    // this will return false if there are no other units on the tile
    .some((tileUnit) => tileUnit.player !== unit.player)
  ),
  new Effect((unit, to, from = unit.tile) => new Attack(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:boardTransport',
  isNeighbouringTile,
  hasEnoughMovesLeft,
  new Criterion((unit) => unit instanceof LandUnit),
  new Criterion((unit, to) => to.terrain instanceof Water),
  new Criterion((unit, to) => UnitRegistry.getBy('tile', to)
    .every((tileUnit) => tileUnit.player === unit.player)
  ),
  new Criterion((unit, to) => UnitRegistry.getBy('tile', to)
    .filter((tileUnit) => tileUnit instanceof NavalTransport)
    .some((tileUnit) => tileUnit.hasCapacity())
  ),
  new Effect((unit, to, from = unit.tile) => new Embark(unit, to, from))
));

[
  [Irrigation, BuildIrrigation, new OneCriteria(
    new Criterion((unit, to, from = unit.tile) => from.terrain instanceof River),
    new Criterion((unit, to, from = unit.tile) => from.isCoast()),
    new Criterion((unit, to, from = unit.tile) => from.getAdjacent()
      .some((tile) => tile.terrain instanceof River ||
        (
          TileImprovementRegistry.getBy('tile', tile)
            .some((improvement) => improvement instanceof Irrigation) &&
          ! CityRegistry.getBy('tile', tile)
            .length
        )
      )
    )
  )],
  [Mine, BuildMine],
  [Road, BuildRoad],
]
  .forEach(([Improvement, Action, ...additionalCriteria]) => RulesRegistry.register(new Rule(
    `unit:action:${Action.name.replace(/^./, (char) => char.toLowerCase())}`,
    hasEnoughMovesLeft,
    new Criterion((unit) => unit instanceof Worker),
    new Criterion((unit, to, from = unit.tile) => RulesRegistry.get('tile:improvement:available')
      .some((rule) => rule.validate(from, Improvement, unit.player))
    ),
    new Criterion((unit, to, from = unit.tile) => from === to),
    new Criterion((unit) => ! TileImprovementRegistry.getBy('tile', unit.tile)
      .some((improvement) => improvement instanceof Improvement)
    ),
    new Effect((unit, to, from = unit.tile) => new Action(unit, to, from)),
    ...additionalCriteria
  )))
;

RulesRegistry.register(new Rule(
  'unit:action:captureCity',
  isNeighbouringTile,
  hasEnoughMovesLeft,
  new Criterion((unit, to) => CityRegistry.getBy('tile', to)
    .some((city) => city.player !== unit.player)
  ),
  new Criterion((unit) => unit instanceof LandUnit),
  new Criterion((unit, to) => ! UnitRegistry.getBy('tile', to)
    .length
  ),
  new Effect((unit, to, from = unit.tile) => new CaptureCity(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:fortify',
  hasEnoughMovesLeft,
  new Criterion((unit) => unit instanceof FortifiableUnit),
  new Criterion((unit, to, from = unit.tile) => from.isLand()),
  new Criterion((unit, to, from = unit.tile) => from === to),
  new Effect((unit, to, from = unit.tile) => new Fortify(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:foundCity',
  hasEnoughMovesLeft,
  new Criterion((unit) => unit instanceof Settlers),
  new Criterion((unit, to, from = unit.tile) => from.isLand()),
  new Criterion((unit, to, from = unit.tile) => ! CityRegistry.getBy('tile', from)
    .length
  ),
  new Criterion((unit, to, from = unit.tile) => from === to),
  new Effect((unit, to, from = unit.tile) => new FoundCity(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:noOrders',
  new Criterion((unit, to, from = unit.tile) => from === to),
  new Effect((unit, to, from = unit.tile) => new NoOrders(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:unload',
  hasEnoughMovesLeft,
  new Criterion((unit) => unit instanceof NavalTransport),
  new Criterion((unit) => unit.hasCargo()),
  new Criterion((unit, to, from = unit.tile) => from === to),
  new Effect((unit, to, from = unit.tile) => new Unload(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:disembark',
  isNeighbouringTile,
  new Criterion((unit) => unit.transport),
  new Criterion((unit, to, from = unit.tile) => unit.transport.tile === from),
  new Effect((unit, to, from = unit.tile) => new Disembark(unit, to, from))
));

[
  [Jungle, ClearJungle],
  [Forest, ClearForest],
  [Plains, PlantForest],
  [Swamp, ClearSwamp],
]
  .forEach(([Terrain, Action]) => RulesRegistry.register(new Rule(
    `unit:action:${Action.name.replace(/^./, (c) => c.toLowerCase())}`,
    hasEnoughMovesLeft,
    new Criterion((unit) => unit instanceof Worker),
    new Criterion((unit, to, from = unit.tile) => to === from),
    new Criterion((unit, to, from = unit.tile) => from.terrain instanceof Terrain),
    new Effect((unit, to, from = unit.tile) => new Action(unit, to, from))
  )))
;
