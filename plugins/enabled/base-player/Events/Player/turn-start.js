import RulesRegistry from '../../../core-rules/RulesRegistry.js';

engine.on('player:turn-start', (player) => {
  RulesRegistry.getInstance()
    .process('player:turn-start', player)
  ;

  player.takeTurn()
    .then(() => engine.emit('player:turn-end', player))
  ;
});
