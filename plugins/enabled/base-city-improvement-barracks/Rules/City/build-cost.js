import Barracks from '../../Barracks.js';
import cityBuildCost from '../../../base-city-improvements/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Barracks, 40);

export default getRules;
