import ClientRegistry from '../../../core-client/ClientRegistry.js';
import RulesRegistry from '../../../core-rules-registry/RulesRegistry.js';

engine.on('player:turn-start', (player) => {
  RulesRegistry.getInstance()
    .process('player:turn-start', player)
  ;

  const [client] = ClientRegistry.getInstance()
    .getBy('player', player)
  ;

  client.takeTurn()
    .then(() => engine.emit('player:turn-end', player))
  ;
});
