import Player from '../../../core-player/Player.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

export const getPlayers = ({
  n = 1,
  rulesRegistry = RulesRegistry.getInstance(),
} = {}) => new Array(n)
  .fill()
  .map(() => new Player({
    rulesRegistry,
  }))
;

export default getPlayers;
