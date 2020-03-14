import CurrentPlayerRegistry from '../../../core-player/CurrentPlayerRegistry.js';
import PlayerRegistry from '../../../core-player/PlayerRegistry.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

engine.on('turn:start', () => {
  const rules = RulesRegistry.getInstance()
      .get('turn:start')
    ,
    currentPlayerRegistry = CurrentPlayerRegistry.getInstance(),
    playerRegistry = PlayerRegistry.getInstance()
  ;

  currentPlayerRegistry.register(...playerRegistry.entries());

  playerRegistry.entries()
    .forEach((player) => rules
      .filter((rule) => rule.validate(player))
      .forEach((rule) => rule.process(player))
    )
  ;

  const [currentPlayer] = currentPlayerRegistry.entries();

  engine.emit('player:turn-start', currentPlayer);
});
