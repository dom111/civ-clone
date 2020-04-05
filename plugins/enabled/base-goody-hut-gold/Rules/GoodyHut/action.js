import Effect from '../../../core-rules/Effect.js';
import Gold from '../../Gold.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'goody-hut:action:gold',
    new Effect((goodyHut, unit) => new Gold({
      goodyHut,
      unit,
    }))
  ),
];

export default getRules;
