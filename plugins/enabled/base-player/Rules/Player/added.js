import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'player:added:event',
    new Effect((player) => engine.emit('player:added', player))
  ),
];

export default getRules;
