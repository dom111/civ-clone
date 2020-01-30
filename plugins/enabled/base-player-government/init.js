// import Effect from '../core-rules/Effect.js';
// import PlayerActionRegistry from '../core-player/PlayerActionRegistry.js';
import PlayerGovernment from './PlayerGovernment.js';
import PlayerGovernmentRegistry from './PlayerGovernmentRegistry.js';

engine.on('player:added', (player) => {
  const playerGovernment = new PlayerGovernment(player);

  PlayerGovernmentRegistry.register(playerGovernment);
});

// engine.on('player:revolt', (player) => {
//   const [playerGovernment] = PlayerGovernmentRegistry.entries()
//     .filter((playerGovernment) => playerGovernment.player === player)
//   ;
//
//   playerGovernment.choose
// });

// TODO: Perhaps an optional action type needs to be created?
// PlayerActionRegistry.register(new Effect((player) => {
//   const [research] = PlayerGovernmentRegistry.entries()
//     .filter((playerResearch) => playerResearch.player === player)
//   ;
//
//   if (! research.isResearching()) {
//     return [research];
//   }
//
//   return [];
// }));
