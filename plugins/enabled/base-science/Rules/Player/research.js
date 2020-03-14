import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'player:research:event',
    new Effect((player, advance) => engine.emit('player:research', player, advance))
  ),
];

export default getRules;
