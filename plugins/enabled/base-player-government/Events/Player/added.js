import PlayerGovernment from '../../PlayerGovernment.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';

engine.on('player:added', (player) => {
  const playerGovernment = new PlayerGovernment(player);

  PlayerGovernmentRegistry.register(playerGovernment);
});
