import Effect from '../../../core-rules/Effect.js';
import PlayerTreasury from '../../PlayerTreasury.js';
import PlayerTreasuryRegistry from '../../PlayerTreasuryRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerTreasuryRegistry = PlayerTreasuryRegistry.getInstance(),
} = {}) => [
  new Rule(
    'player:added:treasury',
    new Effect((player) => playerTreasuryRegistry.register(new PlayerTreasury({player}))
    )
  ),
];

export default getRules;
