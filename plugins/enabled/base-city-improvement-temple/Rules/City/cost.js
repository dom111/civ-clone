import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import {Gold} from '../../../base-currency/Yields.js';
import {Mysticism} from '../../../base-science/Advances.js';
import PlayerResearchRegistry from '../../../core-registry/Registry.js';
import Temple from '../../Temple.js';
import {Unhappiness} from '../../../base-city-happiness/Yields.js';
import cityCost from '../../../base-city-improvements/Rules/City/cost.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
  playerResearchRegistry = PlayerResearchRegistry.getInstance(),
} = {}) => [
  ...cityCost(Temple, Gold, 1, {
    cityImprovementRegistry,
  }),
  ...cityCost(Temple, Unhappiness, 1, {
    cityImprovementRegistry,
    nonNegative: true,
  }),
  ...cityCost(Temple, Unhappiness, 1, {
    Advance: Mysticism,
    cityImprovementRegistry,
    nonNegative: true,
    playerResearchRegistry,
  }),
];

export default getRules;
