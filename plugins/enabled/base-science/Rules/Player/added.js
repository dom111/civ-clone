import Effect from '../../../core-rules/Effect.js';
import PlayerResearch from '../../PlayerResearch.js';
import PlayerResearchRegistry from '../../PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  new Rule(
    'player:added:playerResearch',
    new Effect((player) => playerResearchRegistry.register(new PlayerResearch({player})))
  ),
];

export default getRules;
