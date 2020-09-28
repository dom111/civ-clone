import {ActiveUnit, InactiveUnit} from '../../PlayerActions.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import UnitRegistry from '../../../core-unit/UnitRegistry.js';

export const getRules = ({
  unitRegistry = UnitRegistry.getInstance(),
} = {}) => {
  return [
    new Rule(
      'player:action:active-units',
      new Criterion((player) => unitRegistry.getBy('player', player)
        .some((unit) => unit.active() && unit.moves()
          .value()
        )
      ),
      new Effect((player) => unitRegistry.getBy('player', player)
        .filter((unit) => unit.active() && unit.moves()
          .value()
        )
        .sort((a, b) => a.waiting() - b.waiting())
        .map((unit) => new ActiveUnit(unit))
      )
    ),
    new Rule(
      'player:action:inactive-units',
      new Criterion((player) => unitRegistry.getBy('player', player)
        .some((unit) => ! unit.active() || ! unit.moves()
          .value()
        )
      ),
      new Effect((player) => unitRegistry.getBy('player', player)
        .filter((unit) => ! unit.active() || ! unit.moves()
          .value()
        )
        .sort((a, b) => a.waiting() - b.waiting())
        .map((unit) => new InactiveUnit(unit))
      )
    ),
  ];
};

export default getRules;
