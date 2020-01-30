import PlayerActionProvider from '../core-player/PlayerActionProvider.js';
import PlayerActionRegistry from '../core-player/PlayerActionRegistry.js';
import PlayerResearch from './PlayerResearch.js';
import PlayerResearchRegistry from './PlayerResearchRegistry.js';
import Science from '../base-science/Yields/Science.js';

engine.on('player:added', (player) => PlayerResearchRegistry.register(new PlayerResearch(player)));

engine.on('player:yield', (player, playerYield) => {
  if (playerYield instanceof Science) {
    const [research] = PlayerResearchRegistry
      .filter((playerResearch) => playerResearch.player === player)
    ;

    research.addProgress(playerYield);
  }
});

PlayerActionRegistry.register(new PlayerActionProvider((player) => {
  const [research] = PlayerResearchRegistry
    .filter((playerResearch) => playerResearch.player === player)
  ;

  if (! research.isResearching()) {
    return [research];
  }

  return [];
}));