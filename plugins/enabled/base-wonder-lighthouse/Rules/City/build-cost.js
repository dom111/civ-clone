import Lighthouse from '../../Lighthouse.js';
import cityBuildCost from '../../../base-wonders/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Lighthouse, 200);

export default getRules;
