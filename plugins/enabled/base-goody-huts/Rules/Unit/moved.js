import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import GoodyHutRegistry from '../../../core-goody-huts/GoodyHutRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  goodyHutRegistry = GoodyHutRegistry.getInstance(),
} = {}) => [
  new Rule(
    'unit:moved:discover-goody-hut',
    new Criterion((unit) => goodyHutRegistry.getBy('tile', unit.tile())
      .length > 0
    ),
    new Effect((unit) => {
      const [goodyHut] = goodyHutRegistry.getBy('tile', unit.tile());

      goodyHut.process(unit);
    })
  ),
];

export default getRules;
