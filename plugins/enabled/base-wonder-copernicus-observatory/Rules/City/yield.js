// import {Automobile} from '../../../base-science/Advances.js';
import CopernicusObservatory from '../../CopernicusObservatory.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Low} from '../../../core-rules/Priorities.js';
// import PlayerResearchRegistry from '../../../base-science/PlayerResearchRegistry.js';
import {Research} from '../../../base-science/Yields.js';
import Rule from '../../../core-rules/Rule.js';
import WonderRegistry from '../../../core-wonder/WonderRegistry.js';

export const getRules = ({
  // playerResearchRegistry = PlayerResearchRegistry.getInstance(),
  wonderRegistry = WonderRegistry.getInstance(),
} = {}) => [
  new Rule(
    'city:yield:science:copernicus-observatory',
    new Low(),
    new Criterion((cityYield) => cityYield instanceof Research),
    new Criterion((cityYield, city) => wonderRegistry.getBy('city', city)
      .some((wonder) => wonder instanceof CopernicusObservatory)
    ),
    // new Criterion((cityYield, city) => playerResearchRegistry.getBy('player', city.player())
    //   .some((playerResearch) => ! playerResearch.completed(Automobile))
    // ),
    new Effect((cityYield) => cityYield.add(cityYield))
  ),
];

export default getRules;
