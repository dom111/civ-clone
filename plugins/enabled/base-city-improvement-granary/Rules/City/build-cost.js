import Granary from '../../Granary.js';
import cityBuildCost from '../../../base-city-improvements/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Granary, 60);

export default getRules;
