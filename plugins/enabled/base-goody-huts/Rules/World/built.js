import Effect from '../../../core-rules/Effect.js';
import GoodyHut from '../../../core-goody-huts/GoodyHut.js';
import GoodyHutRegistry from '../../../core-goody-huts/GoodyHutRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';

export const getRules = ({
  goodyHutRegistry = GoodyHutRegistry.getInstance(),
  rulesRegistry = RulesRegistry.getInstance(),
} = {}) => [
  new Rule(
    'world:built:add-goody-huts',
    new Effect((world) => {
      const goodyHutRules = rulesRegistry.get('tile:goody-hut');

      world.getBy((tile) => goodyHutRules.every((rule) => rule.validate(tile)))
        .forEach((tile) => goodyHutRegistry.register(new GoodyHut({
          tile,
        })))
      ;
    })
  ),
];

export default getRules;
