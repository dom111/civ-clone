import Spearman from '../../Spearman.js';
import unitYield from '../../../base-unit/Rules/Unit/yield.js';

export const getRules = () => unitYield(Spearman, 1, 2);

export default getRules;
