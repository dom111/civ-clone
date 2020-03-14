import Effect from '../../../core-rules/Effect.js';
import {Moves} from '../../../core-unit/Yields.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'unit:created:yields',
    new Effect((unit) => unit.moves = new Moves(unit.movement))
  ),
];

export default getRules;
