import CopernicusObservatory from '../../CopernicusObservatory.js';
import cityBuildCost from '../../../base-wonders/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(CopernicusObservatory, 300);

export default getRules;
