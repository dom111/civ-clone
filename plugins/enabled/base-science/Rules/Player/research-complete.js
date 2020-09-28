import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'player:research-complete:event',
    new Effect((playerResearch, advance) => engine.emit('player:research-complete', playerResearch, advance))
  ),
];

export default getRules;
