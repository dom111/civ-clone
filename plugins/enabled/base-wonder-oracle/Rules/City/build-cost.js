import Oracle from '../../Oracle.js';
import cityBuildCost from '../../../base-wonders/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Oracle, 300);

export default getRules;
