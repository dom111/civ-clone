import Catapult from '../../Catapult.js';
import cityBuildCost from '../../../base-unit/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Catapult, 40);

export default getRules;
