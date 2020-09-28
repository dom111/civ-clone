import Swordman from '../../Swordman.js';
import cityBuildCost from '../../../base-unit/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Swordman, 20);

export default getRules;
