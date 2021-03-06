import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Criterion from '../../../core-rules/Criterion.js';
import Effect from '../../../core-rules/Effect.js';
import {Luxuries} from '../../../base-luxuries/Yields.js';
import {Marketplace} from '../../../base-city-improvements-civ1/CityImprovements.js';
import {Marketplace as MarketplaceModifier} from '../../YieldModifier/Marketplace.js';
import Rule from '../../../core-rules/Rule.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => [
  ...[
    [Marketplace, Luxuries, MarketplaceModifier],
  ]
    .map(([Improvement, Yield, YieldModifier]) => new Rule(
      `city:yield:${[Yield, Improvement].map((Entity) => Entity.name).join(':')}`,
      new Criterion((cityYield) => cityYield instanceof Yield),
      new Criterion((cityYield, city) => cityImprovementRegistry.getBy('city', city)
        .some((improvement) => improvement instanceof Improvement)
      ),
      new Effect((cityYield) => cityYield.addModifier(new YieldModifier()))
    )),
];

export default getRules;
