import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import {Gold} from '../../../base-currency/Yields.js';
import Library from '../../Library.js';
import cityCost from '../../../base-city-improvements/Rules/City/cost.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => cityCost(Library, Gold, 1, {
  cityImprovementRegistry,
});

export default getRules;
