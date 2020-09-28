import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import {Gold} from '../../../base-currency/Yields.js';
import Marketplace from '../../Marketplace.js';
import cityCost from '../../../base-city-improvements/Rules/City/cost.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => cityCost(Marketplace, Gold, 1, {
  cityImprovementRegistry,
});

export default getRules;
