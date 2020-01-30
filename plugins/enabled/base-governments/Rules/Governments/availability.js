import Criterion from '../../../core-rules/Criterion.js';
import {Monarchy as MonarchyAdvance} from '../../../base-science/Advances.js';
import {Monarchy as MonarchyGovernment} from '../../Governments.js';
import PlayerResearchRegistry from '../../../base-player-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [MonarchyGovernment, MonarchyAdvance],
]
  .forEach(([Government, Advance]) => {
    RulesRegistry.register(new Rule(
      `player:government:${Government.name.toLowerCase()}`,
      new Criterion((GovernmentType) => GovernmentType === Government),
      new Criterion((Government, player) => {
        const playerResearch = PlayerResearchRegistry.getBy('player', player);

        return playerResearch.hasCompleted(Advance);
      })
    ));
  })
;
