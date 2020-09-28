import Temple from '../../Temple.js';
import cityBuildCost from '../../../base-city-improvements/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Temple, 40);

export default getRules;
