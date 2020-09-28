import Knight from '../../Knight.js';
import cityBuildCost from '../../../base-unit/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Knight, 40);

export default getRules;
