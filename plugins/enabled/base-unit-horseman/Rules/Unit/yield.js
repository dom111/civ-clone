import Horseman from '../../Horseman.js';
import unitYield from '../../../base-unit/Rules/Unit/yield.js';

export const getRules = () => unitYield(Horseman, 2, 1, 2);

export default getRules;
