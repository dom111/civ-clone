import {Monarchy as MonarchyAdvance, TheRepublic} from '../../../base-science/Advances.js';
import {Monarchy as MonarchyGovernment, Republic} from '../../Governments.js';
import Criterion from '../../../core-rules/Criterion.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import RulesRegistry from '../../../core-rules/RulesRegistry.js';

[
  [MonarchyGovernment, MonarchyAdvance],
  [Republic, TheRepublic],
]
  .forEach(([Government, Advance]) => {
    RulesRegistry.register(new Rule(
      `player:government:${Government.name.toLowerCase()}`,
      new Criterion((GovernmentType) => GovernmentType === Government),
      new Criterion((Government, player) => {
        const playerResearch = PlayerResearchRegistry.getBy('player', player);

        return playerResearch.completed(Advance);
      })
    ));
  })
;
