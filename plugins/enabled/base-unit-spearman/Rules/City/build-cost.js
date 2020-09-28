import Spearman from '../../Spearman.js';
import cityBuildCost from '../../../base-unit/Rules/City/build-cost.js';

export const getRules = () => cityBuildCost(Spearman, 20);

export default getRules;
