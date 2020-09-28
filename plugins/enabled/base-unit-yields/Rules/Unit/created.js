import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'unit:created:yields',
    new Effect((unit) => unit.moves()
      .set(unit.movement())
    )
  ),
];

export default getRules;
