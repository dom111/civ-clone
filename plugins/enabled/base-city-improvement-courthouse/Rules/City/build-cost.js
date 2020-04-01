import Courthouse from '../../Courthouse.js';
import cityBuildCost from '../../../base-city-improvements/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Courthouse, 80);

export default getRules;
