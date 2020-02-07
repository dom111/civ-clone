import {
  Attack,
  BoardTransport,
  BuildIrrigation,
  BuildMine,
  BuildRoad,
  CaptureCity,
  Fortify,
  FoundCity,
  Move,
  NoOrders,
} from '../Actions.js';
import {FortifiableUnit, LandUnit, NavalTransport, NavalUnit} from '../../base-unit/Types.js';
import {Irrigation, Mine, Road} from '../../base-terrain-improvements/Improvements.js';
import {Land, Water} from '../../core-terrain/Types.js';
import {Settlers, Worker} from '../../base-unit/Units.js';
import CityRegistry from '../../core-city/CityRegistry.js';
import Criteria from '../../core-rules/Criteria.js';
import Criterion from '../../core-rules/Criterion.js';
import Effect from '../../core-rules/Effect.js';
import OneCriteria from '../../core-rules/OneCriteria.js';
import {River} from '../../base-terrain/Terrains.js';
import Rule from '../../core-rules/Rule.js';
import RulesRegistry from '../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../core-unit/UnitRegistry.js';

const isNeighbouringTile = new OneCriteria(
    new Criterion(
      (unit, to, from = unit.tile) => to.isNeighbourOf(from)
    ),
    // This rule doesn't need to be met if we're being transported.
    new Criterion((unit, to) => UnitRegistry.getBy('tile', to)
      .includes(unit.transport)
    )
  ),
  hasEnoughMovesLeft = new OneCriteria(
    new Criterion((unit) => unit.movesLeft >= .1)
  )
;

RulesRegistry.register(new Rule(
  'unit:action:move',
  isNeighbouringTile,
  hasEnoughMovesLeft,
  new OneCriteria(
    new Criteria(
      new Criterion((unit) => unit instanceof LandUnit),
      new Criterion((unit, to) => to.terrain instanceof Land),
      new Criterion((unit, to) => CityRegistry.getBy('tile', to)
        .every((city) => city.player === unit.player)
      ),
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
  new Effect((unit, to, from = unit.tile) => new BoardTransport(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:buildIrrigation',
  hasEnoughMovesLeft,
  new Criterion((unit) => unit instanceof Worker),
  new Criterion((unit) => Irrigation.availableOn(unit.tile.terrain)),
  new Criterion((unit, to) => unit.tile === to),
  // TODO: doing this a lot already, need to make improvements a value object with a helper method
  new Criterion((unit) => ! unit.tile.improvements.some((improvement) => improvement instanceof Irrigation)),
  new Criterion((unit) => [...unit.tile.getAdjacent(), unit.tile]
    .some((tile) => tile.terrain instanceof River ||
      tile.isCoast() ||
      (
        tile.improvements.some((improvement) => improvement instanceof Irrigation) &&
        ! CityRegistry.getBy('tile', tile)
          .length
      )
    )
  ),
  new Effect((unit, to, from = unit.tile) => new BuildIrrigation(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:buildMine',
  hasEnoughMovesLeft,
  new Criterion((unit) => unit instanceof Worker),
  new Criterion((unit, to, from) => Mine.availableOn(from.terrain)),
  new Criterion((unit, to) => unit.tile === to),
  // TODO: doing this a lot already, need to make improvements a value object with a helper method
  new Criterion((unit, to, from) => ! from.improvements.some((improvement) => improvement instanceof Mine)),
  new Effect((unit, to, from = unit.tile) => new BuildMine(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:buildRoad',
  hasEnoughMovesLeft,
  new Criterion((unit) => unit instanceof Worker),
  new Criterion((unit, to, from) => Mine.availableOn(from.terrain)),
  new Criterion((unit, to) => unit.tile === to),
  // TODO: doing this a lot already, need to make improvements a value object with a helper method
  new Criterion((unit, to, from) => ! from.improvements.some((improvement) => improvement instanceof Road)),
  new Effect((unit, to, from = unit.tile) => new BuildRoad(unit, to, from))
));

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
  new Criterion((unit) => unit.tile.isLand()),
  new Criterion((unit, to) => unit.tile === to),
  new Effect((unit, to, from = unit.tile) => new Fortify(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:foundCity',
  hasEnoughMovesLeft,
  new Criterion((unit) => unit instanceof Settlers),
  new Criterion((unit) => unit.tile.isLand()),
  new Criterion((unit) => ! CityRegistry.getBy('tile', unit.tile)
    .length
  ),
  new Criterion((unit, to) => unit.tile === to),
  new Effect((unit, to, from = unit.tile) => new FoundCity(unit, to, from))
));

RulesRegistry.register(new Rule(
  'unit:action:noOrders',
  new Criterion((unit, to) => unit.tile === to),
  new Effect((unit, to, from = unit.tile) => new NoOrders(unit, to, from))
));
