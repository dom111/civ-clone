import CityRegistry from '../../../core-city/CityRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {FoundCity} from '../../Actions.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';
import Settlers from '../../Settlers.js';
import {hasEnoughMovesLeft} from '../../../base-unit/Rules/Unit/action.js';

export const getRules = ({
  cityRegistry = CityRegistry.getInstance(),
  rulesRegistry = RulesRegistry.getInstance(),
} = {}) => [
  new Rule(
    'unit:action:foundCity',
    hasEnoughMovesLeft,
    new Criterion((unit) => unit instanceof Settlers),
    new Criterion((unit, to, from = unit.tile()) => from.isLand()),
    new Criterion((unit, to, from = unit.tile()) => ! cityRegistry.getBy('tile', from)
      .length
    ),
    new Criterion((unit, to, from = unit.tile()) => from === to),
    new Effect((unit, to, from = unit.tile()) => new FoundCity({unit, to, from, rulesRegistry}))
  ),
];

export default getRules;
