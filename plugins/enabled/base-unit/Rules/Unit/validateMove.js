import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'unit:validateMove:enough',
    new Criterion((unit, movementCost) => unit.moves.value() >= movementCost),
    new Effect((unit, movementCost) => {
      unit.moves.subtract(movementCost);

      return true;
    })
  ),

  new Rule(
    'unit:validateMove:short',
    new Criterion((unit, movementCost) => unit.moves.value() < movementCost),
    new Criterion((unit, movementCost) => (unit.moves.value() / movementCost) >= (Math.random() * 1.5)),
    new Effect((unit) => {
      unit.moves.subtract(unit.moves);

      return true;
    })
  ),
];

export default getRules;
