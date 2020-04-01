import {
  Attack,
  CaptureCity,
  Fortify,
  Move,
  NoOrders,
} from '../../Actions.js';
import {Fortifiable, Land, Naval} from '../../Types.js';
import And from '../../../core-rules/Criteria/And.js';
import CityRegistry from '../../../core-city/CityRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Or from '../../../core-rules/Criteria/Or.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

export const isNeighbouringTile = new Criterion((unit, to, from = unit.tile()) => to.isNeighbourOf(from)),
  hasEnoughMovesLeft = new Criterion((unit) => unit.moves()
    .value() >= .1
  )
;

export const getRules = ({
  cityRegistry = CityRegistry.getInstance(),
  rulesRegistry = RulesRegistry.getInstance(),
  unitRegistry = UnitRegistry.getInstance(),
} = {}) => {
  return [
    new Rule(
      'unit:action:move',
      isNeighbouringTile,
      hasEnoughMovesLeft,
      new Or(
        new And(
          new Criterion((unit) => unit instanceof Land),
          new Criterion((unit, to, from = unit.tile()) => from.isLand()),
          new Criterion((unit, to) => to.isLand()),
          new Criterion((unit, to) => unitRegistry.getBy('tile', to)
            .every((tileUnit) => tileUnit.player() === unit.player())
          )
        ),
        new And(
          new Criterion((unit) => unit instanceof Naval),
          new Or(
            new Criterion((unit, to, from = unit.tile()) => from.isWater()),
            new Criterion((unit, to, from = unit.tile()) => cityRegistry.getBy('tile', from)
              .some((city) => city.player() === unit.player())
            )
          ),
          new Or(
            new Criterion((unit, to) => to.isWater()),
            new Criterion((unit, to) => cityRegistry.getBy('tile', to)
              .some((city) => city.player() === unit.player())
            )
          )
        )
      ),
      new Or(
        new Criterion((unit) => ! (unit instanceof Land)),
        new Or(
          new Criterion((unit, to) => ! cityRegistry.getBy('tile', to)
            .length
          ),
          new Criterion((unit, to) => cityRegistry.getBy('tile', to)
            .every((city) => city.player() === unit.player())
          )
        )
      ),

      // This is analogous to the original Civilization unit adjacency rules
      new Or(
        new Criterion((unit) => ! (unit instanceof Land)),
        new Criterion((unit, to, from = unit.tile()) => ! (
          from.getNeighbours()
            .some((tile) => unitRegistry.getBy('tile', tile)
              .some((tileUnit) => tileUnit.player() !== unit.player())
            ) &&
            to.getNeighbours()
              .some((tile) => unitRegistry.getBy('tile', tile)
                .some((tileUnit) => tileUnit.player() !== unit.player())
              )
        ))
      ),
      new Criterion((unit, to) => unitRegistry.getBy('tile', to)
        .every((tileUnit) => tileUnit.player() === unit.player())
      ),
      new Effect((unit, to, from = unit.tile()) => new Move({unit, to, from, rulesRegistry}))
    ),

    new Rule(
      'unit:action:attack',
      isNeighbouringTile,
      hasEnoughMovesLeft,
      new Or(
        new And(
          new Criterion((unit) => unit instanceof Land),
          new Criterion((unit, to) => to.isLand())
        ),
        new And(
          new Criterion((unit) => unit instanceof Naval),
          new Or(
            new Criterion((unit, to) => to.isWater()),
            new And(
              new Criterion((unit, to) => unitRegistry.getBy('tile', to)
                .some((tileUnit) => tileUnit.player() !== unit.player())
              )
            )
          )
        )
      ),
      new Criterion((unit, to) => unitRegistry.getBy('tile', to)
        // this will return false if there are no other units on the tile
        .some((tileUnit) => tileUnit.player() !== unit.player())
      ),
      new Effect((unit, to, from = unit.tile()) => new Attack({unit, to, from, rulesRegistry}))
    ),

    new Rule(
      'unit:action:captureCity',
      isNeighbouringTile,
      hasEnoughMovesLeft,
      new Criterion((unit, to) => cityRegistry.getBy('tile', to)
        .some((city) => city.player() !== unit.player())
      ),
      new Criterion((unit) => unit instanceof Land),
      new Criterion((unit, to) => ! unitRegistry.getBy('tile', to)
        .length
      ),
      new Effect((unit, to, from = unit.tile()) => new CaptureCity({unit, to, from, rulesRegistry, cityRegistry}))
    ),

    new Rule(
      'unit:action:fortify',
      hasEnoughMovesLeft,
      new Criterion((unit) => unit instanceof Fortifiable),
      new Criterion((unit, to, from = unit.tile()) => from.isLand()),
      new Criterion((unit, to, from = unit.tile()) => from === to),
      new Effect((unit, to, from = unit.tile()) => new Fortify({unit, to, from, rulesRegistry}))
    ),

    new Rule(
      'unit:action:noOrders',
      new Criterion((unit, to, from = unit.tile()) => from === to),
      new Effect((unit, to, from = unit.tile()) => new NoOrders({unit, to, from, rulesRegistry}))
    ),
  ];
};

export default getRules;
