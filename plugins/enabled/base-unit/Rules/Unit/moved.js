import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'unit:moved:event',
    new Effect((unit, action) => engine.emit('unit:moved', unit, action))
  ),
  new Rule(
    'unit:moved:apply-visibility',
    new Effect((unit) => unit.applyVisibility())
  ),
  new Rule(
    'unit:moved:clean-up-moves',
    new Criterion((unit) => unit.moves().value() <= .1),
    new Effect((unit) => unit.moves().set(0))
  ),
  new Rule(
    'unit:moved:deactivate',
    new Criterion((unit) => unit.moves()
      .value() < .1
    ),
    new Effect((unit) => {
      unit.setActive(false);
    })
  ),
];

export default getRules;
