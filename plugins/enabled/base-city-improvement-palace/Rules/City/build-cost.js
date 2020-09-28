import Palace from '../../Palace.js';
import cityBuildCost from '../../../base-city-improvements/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Palace, 200);

export default getRules;
