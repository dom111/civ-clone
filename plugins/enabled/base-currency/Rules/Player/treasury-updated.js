import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'player:treasury:updated:negative',
  new Criterion((playerTreasury) => playerTreasury.value() < 0),
  new Effect((playerTreasury/*, city*/) => {
    // TODO: sell city improvements
    engine.emit('player:treasury-exhausted', playerTreasury.player, playerTreasury);
  })
));
