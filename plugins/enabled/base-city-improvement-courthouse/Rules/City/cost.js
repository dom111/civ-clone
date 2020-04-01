import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import Courthouse from '../../Courthouse.js';
import {Gold} from '../../../base-currency/Yields.js';
import cityCost from '../../../base-city-improvements/Rules/City/cost.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => cityCost(Courthouse, Gold, 1, {
  cityImprovementRegistry,
});

export default getRules;
