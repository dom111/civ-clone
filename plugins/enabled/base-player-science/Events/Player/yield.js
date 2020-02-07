import PlayerResearchRegistry from '../../PlayerResearchRegistry.js';
import {Science} from '../../../base-science/Yields.js';

engine.on('player:yield', (playerYield, player) => {
  if (playerYield instanceof Science) {
    const [playerResearch] = PlayerResearchRegistry.getBy('player', player);

    playerResearch.add(playerYield.value());
  }
});
