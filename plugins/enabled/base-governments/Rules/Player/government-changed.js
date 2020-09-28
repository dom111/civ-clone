import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'player:government-changed:event',
    new Effect((player, government) => engine.emit('player:government:changed', player, government))
  ),
];

export default getRules;
