import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Colosseum from '../../Colosseum.js';
import {Gold} from '../../../base-currency/Yields.js';
import {Unhappiness} from '../../../base-city-happiness/Yields.js';
import cityCost from '../../../base-city-improvements/Rules/City/cost.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => [
  ...cityCost(Colosseum, Gold, 2, {
    cityImprovementRegistry,
  }),
  ...cityCost(Colosseum, Unhappiness, 2, {
    cityImprovementRegistry,
    nonNegative: true,
  }),
];

export default getRules;
