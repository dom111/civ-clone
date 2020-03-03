import Effect from '../../../core-rules/Effect.js';
import PlayerTreasury from '../../PlayerTreasury.js';
import PlayerTreasuryRegistry from '../../PlayerTreasuryRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'player:added:treasury',
  new Effect((player) => PlayerTreasuryRegistry.register(new PlayerTreasury(player)))
));
