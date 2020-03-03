import Effect from '../../../core-rules/Effect.js';
import PlayerGovernment from '../../PlayerGovernment.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'player:added:playerGovernment',
  new Effect((player) => PlayerGovernmentRegistry.register(new PlayerGovernment(player)))
));
