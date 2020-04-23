import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'player:research:event',
    new Effect((playerResearch, advance) => engine.emit('player:research', playerResearch, advance))
  ),
];

export default getRules;
