// import Effect from '../core-rules/Effect.js';
// import PlayerActionRegistry from '../core-player/PlayerActionRegistry.js';

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
//   if (! research.researching()) {
//     return [research];
//   }
//
//   return [];
// }));
