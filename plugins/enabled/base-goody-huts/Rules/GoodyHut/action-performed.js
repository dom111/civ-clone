import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'goody-hut:action-performed:event',
    new Effect((goodyHut, action) => engine.emit('goody-hut:action-performed', goodyHut, action))
  ),
];

export default getRules;
