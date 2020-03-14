import {Monarchy as MonarchyAdvance, TheRepublic} from '../../../base-science/Advances.js';
import {Monarchy as MonarchyGovernment, Republic} from '../../Governments.js';
import Criterion from '../../../core-rules/Criterion.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  ...[
    [MonarchyGovernment, MonarchyAdvance],
    [Republic, TheRepublic],
  ]
    .map(([Government, Advance]) => new Rule(
      `player:government:${Government.name.toLowerCase()}`,
      new Criterion((GovernmentType) => GovernmentType === Government),
      new Criterion((Government, player) => {
        const playerResearch = playerResearchRegistry.getBy('player', player);

        return playerResearch.completed(Advance);
      })
    )),
];

export default getRules;
