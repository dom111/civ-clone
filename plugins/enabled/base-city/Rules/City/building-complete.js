import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'city:building-complete:event',
    new Effect((city, built) => engine.emit('city:building-complete', city, built))
  ),
];

export default getRules;
