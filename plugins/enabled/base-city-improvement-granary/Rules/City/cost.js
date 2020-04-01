import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import {Gold} from '../../../base-currency/Yields.js';
import Granary from '../../Granary.js';
import cityCost from '../../../base-city-improvements/Rules/City/cost.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => cityCost(Granary, Gold, 1, {
  cityImprovementRegistry,
});

export default getRules;
