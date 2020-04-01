import Aqueduct from '../../Aqueduct.js';
import cityBuildCost from '../../../base-city-improvements/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Aqueduct, 120);

export default getRules;
