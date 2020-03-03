import Effect from '../../../core-rules/Effect.js';
import PlayerResearch from '../../PlayerResearch.js';
import PlayerResearchRegistry from '../../PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'player:added:playerResearch',
  new Effect((player) => PlayerResearchRegistry.register(new PlayerResearch(player)))
));
