import Effect from '../../../core-rules/Effect.js';
import GoodyHutRegistry from '../../../core-goody-huts/GoodyHutRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  goodyHutRegistry = GoodyHutRegistry.getInstance(),
} = {}) => [
  new Rule(
    'goody-hut:discovered:unregister',
    new Effect((goodyHut) => goodyHutRegistry.unregister(goodyHut))
  ),
  new Rule(
    'goody-hut:discovered:random-action',
    new Effect((goodyHut, unit) => {
      const availableGoodyHutActions = goodyHut.actions(unit),
        randomAction = availableGoodyHutActions[Math.floor(availableGoodyHutActions.length * Math.random())]
      ;

      goodyHut.action(randomAction);
    })
  ),
  new Rule(
    'goody-hut:discovered:event',
    new Effect((goodyHut, unit) => engine.emit('goody-hut:discovered', goodyHut, unit))
  ),
];

export default getRules;
