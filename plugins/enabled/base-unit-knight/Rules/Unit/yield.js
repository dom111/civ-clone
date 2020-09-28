import Knight from '../../Knight.js';
import unitYield from '../../../base-unit/Rules/Unit/yield.js';

export const getRules = () => unitYield(Knight, 4, 2, 2);

export default getRules;
