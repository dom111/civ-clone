import PlayerResearch from '../../PlayerResearch.js';
import PlayerResearchRegistry from '../../PlayerResearchRegistry.js';

engine.on('player:added', (player) => PlayerResearchRegistry.register(new PlayerResearch(player)));
