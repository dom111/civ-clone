import Aqueduct from '../../Aqueduct.js';
import CityImprovementRegistry from '../../../core-city-improvement/CityImprovementRegistry.js';
import {Gold} from '../../../base-currency/Yields.js';
import cityCost from '../../../base-city-improvements/Rules/City/cost.js';

export const getRules = ({
  cityImprovementRegistry = CityImprovementRegistry.getInstance(),
} = {}) => cityCost(Aqueduct, Gold, 2, {
  cityImprovementRegistry,
});

export default getRules;
