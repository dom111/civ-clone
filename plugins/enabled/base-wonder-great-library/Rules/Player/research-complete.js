import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import GreatLibrary from '../../GreatLibrary.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
  wonderRegistry = WonderRegistry.getInstance(),
} = {}) => [
  new Rule(
    'player:research-complete:great-library',
    new Criterion(() => wonderRegistry.some((wonder) => wonder instanceof GreatLibrary)),
    new Criterion((player, completedResearch) => playerResearchRegistry
      .filter((playerResearch) => playerResearch.completed(completedResearch.constructor))
      .length >= 3
    ),
    new Criterion((player, completedResearch) => {
      const [owningPlayer] = wonderRegistry.filter((wonder) => wonder instanceof GreatLibrary)
          .map((greatLibrary) => greatLibrary.player()),
        [owningPlayerResearch] = playerResearchRegistry.getBy('player', owningPlayer)
      ;

      return ! owningPlayerResearch.completed(completedResearch.constructor);
    }),
    new Effect((player, completedResearch) => {
      const [owningPlayer] = wonderRegistry.filter((wonder) => wonder instanceof GreatLibrary)
          .map((greatLibrary) => greatLibrary.player()),
        [owningPlayerResearch] = playerResearchRegistry.getBy('player', owningPlayer)
      ;

      return owningPlayerResearch.addAdvance(completedResearch.constructor);
    })
  ),
];

export default getRules;
