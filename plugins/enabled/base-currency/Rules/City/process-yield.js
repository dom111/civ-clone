import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Gold} from '../../Yields.js';
import PlayerTreasuryRegistry from '../../PlayerTreasuryRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

export const getRules = ({
  playerTreasuryRegistry = PlayerTreasuryRegistry.getInstance(),
  rulesRegistry = RulesRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:process-yield:gold',
    new Criterion((cityYield) => cityYield instanceof Gold),
    new Effect((cityYield, city) => {
      const [playerTreasury] = playerTreasuryRegistry.getBy('player', city.player());

      playerTreasury.add(cityYield);
      rulesRegistry.process('player:treasury:updated', playerTreasury, city);
    })
  ),
];

export default getRules;
