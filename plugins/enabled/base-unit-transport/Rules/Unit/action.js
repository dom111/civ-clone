import {
  Disembark,
  Embark,
  Unload,
} from '../../Actions.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Land} from '../../../base-unit/Types.js';
import {NavalTransport} from '../../Types.js';
import Or from '../../../core-rules/Criteria/Or.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';
import TransportRegistry from '../../TransportRegistry.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';
import {Water} from '../../../core-terrain/Types.js';

export const getRules = ({
  rulesRegistry = RulesRegistry.getInstance(),
  transportRegistry = TransportRegistry.getInstance(),
  unitRegistry = UnitRegistry.getInstance(),
} = {}) => {
  const isNeighbouringTile = new Criterion((unit, to, from = unit.tile()) => to.isNeighbourOf(from)),
    hasEnoughMovesLeft = new Criterion((unit) => unit.moves()
      .value() >= .1
    )
  ;

  return [
    new Rule(
      'unit:action:embark',
      isNeighbouringTile,
      hasEnoughMovesLeft,
      new Criterion((unit) => unit instanceof Land),
      new Criterion((unit, to) => to.terrain() instanceof Water),
      new Criterion((unit, to) => unitRegistry.getBy('tile', to)
        .every((tileUnit) => tileUnit.player() === unit.player())
      ),
      new Criterion((unit, to) => unitRegistry.getBy('tile', to)
        .filter((tileUnit) => tileUnit instanceof NavalTransport)
        .some((tileUnit) => tileUnit.hasCapacity())
      ),
      new Effect((unit, to, from = unit.tile()) => new Embark({unit, to, from, rulesRegistry}))
    ),

    new Rule(
      'unit:action:disembark',
      isNeighbouringTile,
      new Criterion((unit) => transportRegistry.getBy('unit', unit)
        .length
      ),
      new Or(
        new Criterion((unit) => ! (unit instanceof Land)),
        new Criterion((unit, to) => to.isLand())
      ),
      new Criterion((unit, to, from = unit.tile()) => transportRegistry.getBy('unit', unit)
        .every((manifest) => manifest.transport()
          .tile() === from
        )
      ),
      new Effect((unit, to, from = unit.tile()) => new Disembark({unit, to, from, rulesRegistry}))
    ),

    new Rule(
      'unit:action:unload',
      hasEnoughMovesLeft,
      new Criterion((unit) => unit instanceof NavalTransport),
      new Criterion((unit) => unit.hasCargo()),
      new Criterion((unit, to, from = unit.tile()) => from === to),
      new Criterion((unit, to) => to.getNeighbours()
        .some((tile) => tile.isLand())
      ),
      new Effect((unit, to, from = unit.tile()) => new Unload({unit, to, from, rulesRegistry}))
    ),
  ];
};

export default getRules;
