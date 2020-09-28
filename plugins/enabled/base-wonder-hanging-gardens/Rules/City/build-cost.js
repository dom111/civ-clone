import HangingGardens from '../../HangingGardens.js';
import cityBuildCost from '../../../base-wonders/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(HangingGardens, 300);

export default getRules;
