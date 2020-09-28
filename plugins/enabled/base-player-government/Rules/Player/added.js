import Effect from '../../../core-rules/Effect.js';
import PlayerGovernment from '../../PlayerGovernment.js';
import PlayerGovernmentRegistry from '../../PlayerGovernmentRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerGovernmentRegistry = PlayerGovernmentRegistry.getInstance(),
} = {}) => [
  new Rule(
    'player:added:playerGovernment',
    new Effect((player) => playerGovernmentRegistry.register(new PlayerGovernment({player})))
  ),
];

export default getRules;
