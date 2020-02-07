import PlayerTreasury from '../../PlayerTreasury.js';
import PlayerTreasuryRegistry from '../../PlayerTreasuryRegistry.js';

engine.on('player:added', (player) => {
  const playerTreasury = new PlayerTreasury(player);

  PlayerTreasuryRegistry.register(playerTreasury);
});
