import PlayerActionProvider from '../../../core-player/PlayerActionProvider.js';
import PlayerActionRegistry from '../../../core-player/PlayerActionRegistry.js';
import PlayerResearchRegistry from '../../PlayerResearchRegistry.js';

engine.on('game:start', () => {
  PlayerActionRegistry.register(new PlayerActionProvider((player) => {
    const [research] = PlayerResearchRegistry
        .filter((playerResearch) => playerResearch.player === player),
      [availableResearch] = research.available()
    ;

    if (! research.researching() && availableResearch) {
      return [research];
    }

    return [];
  }));
});
