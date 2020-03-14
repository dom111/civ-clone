import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = () => [
  new Rule(
    'player:treasury:updated:negative',
    new Criterion((playerTreasury) => playerTreasury.value() < 0),
    // TODO: sell city improvements
    new Effect((playerTreasury/*, city*/) => {
      engine.emit('player:treasury-exhausted', playerTreasury.player, playerTreasury);
    })
  ),
];

export default getRules;
