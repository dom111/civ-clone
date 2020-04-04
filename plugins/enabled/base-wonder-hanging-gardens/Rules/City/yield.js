import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {HangingGardens} from '../../HangingGardens.js';
import {Happiness} from '../../../base-city-happiness/Yields.js';
import {Invention} from '../../../base-science/Advances.js';
import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import Rule from '../../../core-rules/Rule.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';

export const getRules = ({
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
  wonderRegistry = WonderRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:yield:happiness:hanging-gardens',
    new Criterion((cityYield) => cityYield instanceof Happiness),
    new Criterion((cityYield, city) => wonderRegistry.filter((wonder) => wonder instanceof HangingGardens)
      .some((wonder) => wonder.city().player() === city.player())
    ),
    new Criterion((cityYield, city) => playerResearchRegistry.getBy('player', city.player())
      .some((playerResearch) => ! playerResearch.completed(Invention))
    ),
    new Effect((cityYield) => cityYield.add(1))
  ),
];

export default getRules;
