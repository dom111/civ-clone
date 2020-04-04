import Criterion from '../../../core-rules/Criterion.js';
import CurrentPlayerRegistry from '../../../core-player/CurrentPlayerRegistry.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';

export const getRules = ({
  currentPlayerRegistry = CurrentPlayerRegistry.getInstance(),
  rulesRegistry = RulesRegistry.getInstance(),
} = {}) => [
  new Rule(
    'player:turn-end:next-player',
    new Criterion(() => currentPlayerRegistry.length > 1),
    new Effect((player) => {
      currentPlayerRegistry.unregister(player);

      const [nextPlayer] = currentPlayerRegistry.entries();

      engine.emit('player:turn-start', nextPlayer);
      rulesRegistry.process('player:turn-start', nextPlayer);
    })
  ),
  new Rule(
    'player:turn-end:end-turn',
    new Criterion(() => currentPlayerRegistry.length <= 1),
    new Effect((player) => {
      currentPlayerRegistry.unregister(player);
      engine.emit('turn:end');
    })
  ),
  new Rule(
    'player:turn-end:event',
    new Effect((player) => engine.emit('player:turn-end', player))
  ),
];

export default getRules;
