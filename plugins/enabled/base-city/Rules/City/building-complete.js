import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'city:building-complete:event',
    new Effect((cityBuild, built) => engine.emit('city:building-complete', cityBuild, built))
  ),
];

export default getRules;
