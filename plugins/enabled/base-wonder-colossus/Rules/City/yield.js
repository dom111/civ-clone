import Colossus from '../../Colossus.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
// import {Electricity} from '../../../base-science/Advances.js';
import {High} from '../../../core-rules/Priorities.js';
import Rule from '../../../core-rules/Rule.js';
import {Trade} from '../../../base-terrain-yield-trade/Yields.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';
// import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';

export const getRules = ({
  // playerResearchRegistry = PlayerResearchRegistry.getInstance(),
  wonderRegistry = WonderRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:yield:trade:colossus',
    new High(),
    new Criterion((cityYield) => cityYield instanceof Trade),
    new Criterion((cityYield, city) => wonderRegistry.getBy('city', city)
      .some((wonder) => wonder instanceof Colossus)
    ),
    // new Criterion((cityYield, city) => playerResearchRegistry.getBy('player', city.player())
    //   .some((playerResearch) => ! playerResearch.completed(Electricity))
    // ),
    new Effect((cityYield, city) => cityYield.add(city.tilesWorked()
      .filter((tile) => tile.yields({
        yields: [Trade],
      })
        .every((tileYield) => tileYield.value() > 0)
      )
      .length
    ))
  ),
];

export default getRules;
