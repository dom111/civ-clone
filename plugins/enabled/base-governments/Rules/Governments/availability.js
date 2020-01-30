import Criterion from '../../../core-rules/Criterion.js';
import {Monarchy as MonarchyAdvance} from '../../../base-science/Advances.js';
import {Monarchy as MonarchyGovernment} from '../../Governments.js';
import PlayerResearchRegistry from '../../../base-player-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

RulesRegistry.register(new Rule(
  'player:government:monarchy',
  new Criterion((Government) => Government === MonarchyGovernment),
  new Criterion((Government, player) => {
    const playerResearch = PlayerResearchRegistry
      .filter((playerResearch) => playerResearch.player === player)
    ;

    return playerResearch.hasCompleted(MonarchyAdvance);
  })
));