import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import Or from '../../../core-rules/Criteria/Or.js';
import PlayerResearchRegistry from '../../../core-registry/Registry.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = (CityImprovement, Yield, cost, {
  Advance = null,
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
  nonNegative = false,
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  new Rule(
    `city:cost:${[CityImprovement, Yield].map((Entity) => Entity.name.toLowerCase()).join(':')}`,
    new Criterion((tileYield) => tileYield instanceof Yield),
    new Criterion((tileYield, city) => cityImprovementRegistry.getBy('city', city)
      .some((improvement) => improvement instanceof CityImprovement)
    ),
    new Or(
      new Criterion(() => ! Advance),
      new Criterion((tileYield, city) => playerResearchRegistry.getBy('player', city.player())
        .some((playerResearch) => playerResearch.completed(Advance))
      )
    ),
    new Effect((tileYield) => tileYield.subtract(nonNegative ? Math.min(tileYield.value(), cost) : cost))
  ),
];

export default getRules;
