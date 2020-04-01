import Settlers from '../../Settlers.js';
import cityBuildCost from '../../../base-unit/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Settlers, 40);

export default getRules;
