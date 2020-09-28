import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import Unit from '../../Unit.js';

export const getRules = () => [
  new Rule(
    'goody-hut:action:unit',
    new Effect((goodyHut, unit) => new Unit({
      goodyHut,
      unit,
    }))
  ),
];

export default getRules;
