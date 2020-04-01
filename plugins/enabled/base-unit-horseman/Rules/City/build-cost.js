import Horseman from '../../Horseman.js';
import cityBuildCost from '../../../base-unit/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Horseman, 20);

export default getRules;
