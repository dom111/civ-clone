import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

export const getRules = ({
  rulesRegistry = RulesRegistry.getInstance(),
} = {}) => [
  new Rule(
    'player:turn-start:take-turn',
    new Effect((player) => player.takeTurn()
      .then(() => rulesRegistry.process('player:turn-end', player)
      ))
  ),
];

export default getRules;
