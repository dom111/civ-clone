import {Gold} from '../../Yields.js';
import PlayerTreasuryRegistry from '../../PlayerTreasuryRegistry.js';

engine.on('player:yield', (playerYield, player) => {
  if (playerYield instanceof Gold) {
    const [playerTreasury] = PlayerTreasuryRegistry.getBy('player', player);

    playerTreasury.add(playerYield.value());
  }
});
